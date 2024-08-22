import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import stringHelpers from '@adonisjs/core/helpers/string'

type TokenType = 'PASSWORD_RESET' | 'VERIFY_EMAIL'
export default class Token extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare type: string

  @column()
  declare token: string

  @column.dateTime()
  declare expiresAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  static async generateVerifyEmailToken(user: User) {
    const token = stringHelpers.generateRandom(64)

    // Expire/Delete old tokens
    await Token.expireTokens(user, 'verifyEmailTokens')

    // Create token record
    const record = await user.related('verifyEmailTokens').create({
      type: 'VERIFY_EMAIL',
      expiresAt: DateTime.now().plus({ hours: 24 }),
      token,
    })

    return record.token
  }

  static async generatePasswordResetToken(user: User | null) {
    const token = stringHelpers.generateRandom(64)

    if (!user) {
      return token
    }

    // Expire/Delete old tokens
    await Token.expireTokens(user, 'passwordResetTokens')

    const record = await user.related('tokens').create({
      type: 'PASSWORD_RESET',
      expiresAt: DateTime.now().plus({ hour: 1 }),
      token,
    })

    return record.token
  }

  static async expireTokens(user: User, relationName: 'passwordResetTokens' | 'verifyEmailTokens') {
    await user.related(relationName).query().update({
      expiresAt: DateTime.now(),
    })
  }

  static async getTokenUser(token: string, type: TokenType) {
    const record = await Token.query()
      .preload('user')
      .where('token', token)
      .where('type', type)
      .where('expiresAt', '>', DateTime.now().toSQL())
      .orderBy('createdAt', 'desc')
      .first()

    return record?.user
  }

  static async verify(token: string, type: TokenType) {
    const record = await Token.query()
      .where('expiresAt', '>', DateTime.now().toSQL())
      .where('token', token)
      .where('type', type)
      .first()

    return !!record
  }
}
