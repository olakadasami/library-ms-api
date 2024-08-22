import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Genre from './genre.js'
import Borrowing from './borrowing.js'

export default class Book extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare author: string

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare available: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Relationships
   */
  @manyToMany(() => Genre, {
    pivotTable: 'book_genres',
  })
  declare genres: ManyToMany<typeof Genre>

  @hasMany(() => Borrowing)
  declare borrowings: HasMany<typeof Borrowing>
}
