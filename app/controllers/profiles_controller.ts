import Profile from '#models/profile'
import { profileUpdateValidator } from '#validators/profile'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  /**
   * Handle form submission for the create action
   *
   * POST ''
   */
  async store({ request, bouncer, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const userData = await request.validateUsing(profileUpdateValidator)

    // await bouncer.with(UserPolicy).authorize('store')

    const profile = await user.related('profile').create(userData)

    return profile
  }

  /**
   * Show individual record
   *
   */
  async show({ bouncer, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    // await bouncer.with(UserPolicy).authorize('view')

    const profile = await user.related('profile').query()

    return profile
  }

  /**
   * Handle form submission for the edit action
   *
   * PATCH
   */
  async update({ request, bouncer, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const profileData = await request.validateUsing(profileUpdateValidator)

    const profile = await Profile.updateOrCreate({ userId: user.id }, profileData)

    return response.status(200).json(profile)
  }

  /**
   * Delete record
   *
   */
  async destroy({ response, bouncer, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    await Profile.query().where('userId', user.id).delete()

    return response.status(204).json(null)
  }
}
