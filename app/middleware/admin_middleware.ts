import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    // Check if the user is logged in
    await auth.authenticate()

    // // Get the authenticated user
    const user = auth.getUserOrFail()

    // Check if the user is an admin
    if (user.roleId !== 3) {
      return response.status(403).json({
        status: 'Forbidden',
        statusCode: 403,
        message: 'Access denied: You do not have permission to access this resource.',
      })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
