import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as authErrors } from '@adonisjs/auth'
import { errors } from '@adonisjs/core'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
      return ctx.response.status(400).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 400,
      })
    }
    if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
      return ctx.response.status(401).json({
        status: 'Unauthorized',
        message: 'Not Authenticated',
        statusCode: 401,
      })
    }
    if (error instanceof errors.E_ROUTE_NOT_FOUND) {
      // handle error
      return ctx.response.status(404).json({
        status: 'Not Found',
        message: 'Route/Method does not exist',
        statusCode: 404,
      })
    }

    // if (error instanceof bouncerErrors.E_AUTHORIZATION_FAILURE) {
    //   return ctx.response.status(403).json({
    //     status: 'Forbidden',
    //     statusCode: 403,
    //     message: 'Access denied: You do not have permission to access this resource.',
    //   })
    // }
    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
