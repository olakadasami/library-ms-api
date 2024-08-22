import Book from '#models/book'
import Borrowing from '#models/borrowing'
import { borrowValidator } from '#validators/borrowing'
import type { HttpContext } from '@adonisjs/core/http'
import BorrowStatus from '../enums/borrow_status.js'
import { DateTime } from 'luxon'
import Fine from '#models/fine'

export default class BorrowBooksController {
  async borrow({ request, response }: HttpContext) {
    const { bookId, userId } = await request.validateUsing(borrowValidator)
    const book = await Book.findOrFail(bookId)

    // Check book's availability
    if (!book.available) {
      return response.status(400).json({
        message: 'Book is not available for borrowing',
      })
    }

    // if book is available
    const newBorrow = await Borrowing.create({
      bookId,
      userId,
      dueDate: DateTime.now().plus({ weeks: 2 }), // Book is due in 14days by default
    })
    book.available = false
    await book.save()

    response.status(201).json(newBorrow)
  }

  async return({ request }: HttpContext) {
    const { bookId, userId } = await request.validateUsing(borrowValidator)
    const book = await Book.findOrFail(bookId)

    const borrowing = await Borrowing.query()
      .where('bookId', bookId)
      .where('userId', userId)
      .firstOrFail()
    borrowing.status = BorrowStatus.NOT_ACTIVE
    await borrowing.save()
    book.available = true
    await book.save()

    await Borrowing.calculateFine(borrowing)

    return {
      message: 'Book returned successfully',
      borrowing,
    }
  }

  /**
   * @renew
   * @operationId renewBorrowing
   * @description Renews borrowing by extending dueDate by 2 weeks
   * @summary Renews borrowing
   * @responseBody 200 - <Book>
   * @paramUse(sortable, filterable)
   * @responseHeader 200 - @use(paginated)
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async renew({ request, response }: HttpContext) {
    const { bookId, userId } = await request.validateUsing(borrowValidator)
    const book = await Book.findOrFail(bookId)

    if (book.available) {
      return response.status(400).json({
        message: 'Only books that have been borrowed can be renewed',
      })
    }
    const borrow = await Borrowing.query()
      .where('bookId', bookId)
      .where('userId', userId)
      .firstOrFail()
    borrow.dueDate = DateTime.now().plus({ weeks: 2 })
    await borrow.save()

    response.json(book)
  }

  async checkOverdueBooks({ response }: HttpContext) {
    const overdueBorrowings = await Borrowing.query()
      .whereNull('returnDate')
      .where('dueDate', '<', DateTime.now().toISO())

    if (overdueBorrowings.length) {
      for (const borrowing of overdueBorrowings) {
        await Borrowing.calculateFine(borrowing)
      }
    }

    response.ok({
      message: 'Fines calculated for overdue books',
      overdueBorrowings,
    })
  }

  async payFine({ params, response }: HttpContext) {
    const fine = await Fine.findOrFail(params.fineId)

    fine.paid = true
    await fine.save()

    return response.ok({
      message: 'Fine paid successfully!',
      fine,
    })
  }

  async history({ params }: HttpContext) {
    const userHistory = await Borrowing.query()
      .where('user_id', params.userId)
      .preload('book', (bookQuery) => {
        bookQuery.select('title', 'author', 'description')
      })
    return userHistory
  }

  async getUserFine({ params }: HttpContext) {
    const userOverdueBorrowings = await Borrowing.query()
      .where('user_id', params.userId)
      .whereNull('returnDate')
      .where('dueDate', '<', DateTime.now().toISO())

    for (const borrowing of userOverdueBorrowings) {
      await Borrowing.calculateFine(borrowing)
    }
    return userOverdueBorrowings
  }
}
