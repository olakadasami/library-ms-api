import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import mail from '@adonisjs/mail/services/main'
import Token from './token.js'
import VerifyEmail from '#mails/verify_email'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Profile from './profile.js'
import Borrowing from './borrowing.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleId: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column()
  declare isVerified: boolean

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @hasMany(() => Token)
  declare tokens: HasMany<typeof Token>

  @hasMany(() => Token, {
    onQuery: (query) => query.where('type', 'PASSWORD_RESET'),
  })
  declare passwordResetTokens: HasMany<typeof Token>

  @hasMany(() => Token, {
    onQuery: (query) => query.where('type', 'VERIFY_EMAIL'),
  })
  declare verifyEmailTokens: HasMany<typeof Token>

  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile>

  @hasMany(() => Borrowing)
  declare borrowings: HasMany<typeof Borrowing>

  // Static Methods
  static accessTokens = DbAccessTokensProvider.forModel(User)

  // Instance Methods
  async sendVerifyEmail() {
    const token = await Token.generateVerifyEmailToken(this)

    await mail.sendLater(new VerifyEmail(this, token))
  }
}
