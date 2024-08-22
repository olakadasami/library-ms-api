import { BasePolicy as BouncerBasePolicy } from '@adonisjs/bouncer'
import Roles from '../enums/roles.js'
import User from '#models/user'

export default class BasePolicy extends BouncerBasePolicy {
  async before(user: User | null) {
    if (user?.roleId === Roles.ADMIN) {
      return true
    }
  }
}
