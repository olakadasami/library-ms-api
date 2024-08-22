import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Book from './book.js'
import Fine from './fine.js'

export default class Borrowing extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare bookId: number

  @column()
  declare status: number

  @column()
  declare dueDate: DateTime

  @column.dateTime()
  declare returnDate: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Book)
  declare book: BelongsTo<typeof Book>

  @hasOne(() => Fine)
  declare fine: HasOne<typeof Fine>

  // Static Methods
  static async calculateFine(borrowing: Borrowing) {
    const now = DateTime.local()
    const dueDate = borrowing.dueDate

    if (borrowing.returnDate === null && now > dueDate) {
      const daysLate = Math.ceil(now.diff(dueDate, 'days').days)
      const fineAmount = daysLate * 2 // assuming $2 fine per day

      await Fine.create({
        borrowingId: borrowing.id,
        amount: fineAmount,
        paid: false,
      })
    }
  }
}
