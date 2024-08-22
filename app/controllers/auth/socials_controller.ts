import type { HttpContext } from '@adonisjs/core/http'

export default class SocialsController {
  async redirect({ ally, params }: HttpContext) {
    return ally.use(params.provider).redirect()
  }

  async callback({ ally, params }: HttpContext) {
    const driverInstance = ally.use(params.provider)

    /**
     * User has denied access by canceling
     * the login flow
     */
    if (driverInstance.accessDenied()) {
      return 'You have cancelled the login process'
    }

    /**
     * OAuth state verification failed. This happens when the
     * CSRF cookie gets expired.
     */
    if (driverInstance.stateMisMatch()) {
      return 'We are unable to verify the request. Please try again'
    }

    /**
     * GitHub responded with some error
     */
    if (driverInstance.hasError()) {
      return driverInstance.getError()
    }

    /**
     * Access user info
     */
    const user = await driverInstance.user()
    console.log({ user })
    return user
  }
}
