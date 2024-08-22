import User from '#models/user'
import env from '#start/env'
import router from '@adonisjs/core/services/router'
import { BaseMail } from '@adonisjs/mail'

export default class VerifyEmail extends BaseMail {
  constructor(
    private user: User,
    private token: string
  ) {
    super()
  }

  from = 'noreply@olaks.com'
  subject = 'Please verify your email'

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    const path = router.makeUrl('verify.email', { token: this.token })
    const domain = env.get('APP_URL')
    const url = domain + path
    this.message.to(this.user.email).htmlView('emails/verify', { url, user: this.user })
  }
}
