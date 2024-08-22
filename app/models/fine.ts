import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Borrowing from './borrowing.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Fine extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare borrowingId: number

  @column()
  declare amount: number

  @column()
  declare paid: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => Borrowing)
  declare borrowing: BelongsTo<typeof Borrowing>
}
