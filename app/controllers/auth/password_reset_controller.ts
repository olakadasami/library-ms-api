import Token from '#models/token'
import User from '#models/user'
import env from '#start/env'
import { resetPasswordValidator } from '#validators/auth'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import mail from '@adonisjs/mail/services/main'

export default class PasswordResetController {
  async forgot({ request }: HttpContext) {
    const { email } = request.only(['email'])

    const user = await User.findByOrFail('email', email)
    const token = await Token.generatePasswordResetToken(user)
    const resetUrl = router.makeUrl('password.reset.show', { token })
    const url = `${env.get('APP_URL')}${resetUrl}`

    await mail.send((message) => {
      message
        .from('noreply@olaks.com')
        .to(user.email)
        .subject('Reset Password')
        .htmlView('emails/reset_password', { url, user })
    })

    return { message: 'Check your email' }
  }

  async show({ view, params }: HttpContext) {
    const token = params.token
    const isValid = await Token.verify(token, 'PASSWORD_RESET')

    return view.render('auth/forgot_password', { isValid, token })
  }

  async reset({ request }: HttpContext) {
    const { password, token } = await request.validateUsing(resetPasswordValidator)
    const user = await Token.getTokenUser(token, 'PASSWORD_RESET')

    if (!user) {
      throw new Exception('Invalid Token, No user found', { status: 401 })
    }

    await user.merge({ password }).save()

    return {
      message: 'Password reset successful',
    }
  }
}
