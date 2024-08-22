import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async handle({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user)

    return {
      message: 'Login success',
      statusCode: 200,
      data: {
        user,
        accessToken: token.toJSON().token,
      },
    }
  }
}
