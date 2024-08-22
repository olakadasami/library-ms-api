import User from '#models/user'
import UserPolicy from '#policies/user_policy'
import { registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * @index
   * @description Display a list of Users
   *
   * GET ''
   */
  async index({ bouncer }: HttpContext) {
    const users = await User.all()

    await bouncer.with(UserPolicy).authorize('viewAll')

    return users
  }

  /**
   * Handle form submission for the create action
   *
   * POST ''
   */
  async store({ request, bouncer }: HttpContext) {
    const userData = await request.validateUsing(registerValidator)

    await bouncer.with(UserPolicy).authorize('store')

    const user = await User.create(userData)

    return user
  }

  /**
   * Show individual record
   *
   * GET ':id'
   */
  async show({ params, bouncer }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await bouncer.with(UserPolicy).authorize('view')

    return user
  }

  /**
   * Handle form submission for the edit action
   *
   * PATCH ':id'
   */
  async update({ params, request, bouncer }: HttpContext) {
    const data = request.only(['firstName', 'lastName'])
    const user = await User.findOrFail(params.id)

    await bouncer.with(UserPolicy).authorize('update', user)

    const updatedUser = await user.merge(data).save()
    return updatedUser
  }

  /**
   * Delete record
   *
   * DELETE ':id'
   */
  async destroy({ params, response, bouncer }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await bouncer.with(UserPolicy).authorize('destroy', user)

    await user.delete()

    return response.status(204).json(null)
  }
}
