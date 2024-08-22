import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutController {
  async handle({ response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const token = user.currentAccessToken.identifier
    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }

    // if (request.header('referer', '')?.includes('/admin')) {
    //   return response.redirect().toRoute('auth.login.show')
    // }
    await User.accessTokens.delete(user, token)
    return response.ok({ message: 'Logged out' })
  }
}
