import Book from '#models/book'
import { bookValidator } from '#validators/book'
import type { HttpContext } from '@adonisjs/core/http'

export default class BooksController {
  /**
   * @index
   * @description Display a list of books
   * users can search from the list
   *
   * GET ''
   */
  async index({ request }: HttpContext) {
    const { title, author, genre, available, q, page } = request.qs()

    const bookQuery = Book.query()

    if (title) {
      bookQuery.where('title', 'like', `%${title}%`)
    }
    if (author) {
      bookQuery.where('author', 'like', `%${author}%`)
    }
    if (genre) {
      bookQuery.where('genre', 'like', `%${genre}%`)
    }
    if (available) {
      bookQuery.where('available', `${available}`)
    }
    if (q) {
      bookQuery
        .where('title', 'like', `%${q}%`)
        .orWhere('author', 'like', `%${q}%`)
        .orWhere('genre', 'like', `%${q}%`)
    }
    if (page) {
      bookQuery.paginate(Number(page), 5)
      // bookQuery.forPage(Number(page), 5)
    }

    const books = await bookQuery.paginate(Number(page) || 1, 5)

    return books
  }

  /**
   * @store
   * @summary Handle form submission for the create action
   * POST ''
   */
  async store({ request }: HttpContext) {
    const bookData = await request.validateUsing(bookValidator)

    const book = await Book.create(bookData)

    return book
  }

  /**
   * @show
   * @description Get a single book
   * GET ':id'
   */
  async show({ params }: HttpContext) {
    const book = await Book.findOrFail(params.id)

    return book
  }

  /**
   * @responseBody 200
   * @responseBody 404 - Product could not be found
   * @requestBody <Book>
   */
  async update({ params, request }: HttpContext) {
    const book = await Book.findOrFail(params.id)
    const bookData = await request.validateUsing(bookValidator)

    book.merge(bookData)
    await book.save()

    return book
  }

  /**
   * Delete record
   *
   * DELETE ':id'
   */
  async destroy({ params, response }: HttpContext) {
    const book = await Book.findOrFail(params.id)

    await book.delete()

    return response.status(204).json(null)
  }
}
