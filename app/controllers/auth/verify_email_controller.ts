import Token from '#models/token'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

export default class VerifyEmailController {
  async verify({ params }: HttpContext) {
    // Get user from token in params
    const user = await Token.getTokenUser(params.token, 'VERIFY_EMAIL')

    if (!user) {
      throw new Exception('Invalid Token', {
        code: 'E_NOT_AUTHORIZED',
      })
    }

    user.isVerified = true
    await user.save()

    // Expire/delete the token to render invalid
    await Token.expireTokens(user, 'verifyEmailTokens')

    return 'You have been successfully verified, Now login'
  }
}
