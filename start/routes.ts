/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
const BookReservationsController = () => import('#controllers/book_reservations_controller')
const BorrowBooksController = () => import('#controllers/borrow_books_controller')
const BooksController = () => import('#controllers/books_controller')
const VerifyEmailController = () => import('#controllers/auth/verify_email_controller')
const UsersController = () => import('#controllers/users_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')

router.get('/', async () => {
  return {
    message: 'Library Management System API',
  }
})

/**
 * Api documentation using swagger
 */
router.group(() => {
  // returns swagger in YAML
  router.get('/swagger', async () => {
    return AutoSwagger.default.docs(router.toJSON(), swagger)
  })

  // Renders Swagger-UI and passes YAML-output of /swagger
  router.get('/docs', async () => {
    return AutoSwagger.default.ui('/swagger', swagger)
    // return AutoSwagger.default.scalar('/swagger') //to use Scalar instead
    // return AutoSwagger.default.rapidoc('/swagger', 'view') //to use RapiDoc instead (pass "view" default, or "read" to change the render-style)
  })
})

//
router.get('verify/email/:token', [VerifyEmailController, 'verify']).as('verify.email')

// Test admin middleware
router
  .get('/admin', async () => {
    return {
      hello: 'admin',
    }
  })
  .use(middleware.admin())

/**
 * API routes
 */
router
  .group(() => {
    /**
     * API Version 1
     */
    router
      .group(() => {
        /**
         * Authentication Routes
         */
        router
          .group(() => {
            router.post('/login', [LoginController]).as('login')
            router.post('/register', [RegisterController]).as('register')
            router.post('/logout', [LogoutController]).as('logout').use(middleware.auth())
          })
          .as('auth')
          .prefix('auth')

        /**
         * Users Routes
         */
        router
          .resource('users', UsersController)
          .apiOnly()
          .as('users')
          .use('*', [middleware.auth(), middleware.admin()])

        /**
         * Books routes
         */
        router
          .resource('books', BooksController)
          .apiOnly()
          .as('books')
          // .use('*', middleware.auth())
          .use(['store', 'destroy', 'update'], [middleware.auth(), middleware.admin()])

        // Borrow Routes
        router
          .group(() => {
            router.post('/', [BorrowBooksController, 'borrow']).as('create')
            router.post('/return', [BorrowBooksController, 'return']).as('return')
            router.post('/renew', [BorrowBooksController, 'renew']).as('renew')
            router
              .get('/overdue', [BorrowBooksController, 'checkOverdueBooks'])
              .as('overdue')
              .use(middleware.admin())
            router.get('/users/:userId', [BorrowBooksController, 'history']).as('history')
          })
          .prefix('borrowings')
          .as('borrowings')
          .use(middleware.auth())

        // Fine Routes
        router
          .group(() => {
            router.post('/', [BorrowBooksController, 'payFine']).as('pay')
            router.get('/:userId', [BorrowBooksController, 'getUserFine']).as('show')
          })
          .prefix('fines')
          .as('fines')
          .use(middleware.auth())

        // Book Reservation Routes
        router
          .group(() => {
            router.post('/', [BookReservationsController, 'create']).as('create')
            router.delete('/:reservationId', [BookReservationsController, 'destroy']).as('destroy')
          })
          .as('reservations')
          .prefix('reservations')
          .use(middleware.auth())
      })
      .prefix('v1')
  })
  .prefix('api')
