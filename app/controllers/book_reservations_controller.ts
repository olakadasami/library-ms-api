import Reservation from '#models/reservation'
import { createReservationValidator } from '#validators/reservation'
import type { HttpContext } from '@adonisjs/core/http'

export default class BookReservationsController {
  async create({ request, response }: HttpContext) {
    const { bookId, userId } = await request.validateUsing(createReservationValidator)

    const newReservation = await Reservation.create({
      bookId,
      userId,
    })

    response.created(newReservation)
  }

  /**
   *
   * @param param0
   */
  async destroy({ params, response }: HttpContext) {
    const reservation = await Reservation.findOrFail(params.reservationId)

    await reservation.delete()

    response.noContent()
  }
}
