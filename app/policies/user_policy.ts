import User from '#models/user'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import BasePolicy from './base_policy.js'

export default class UserPolicy extends BasePolicy {
  view(_: User): AuthorizerResponse {
    return true
  }

  viewAll(_: User): AuthorizerResponse {
    return false
  }

  store(_: User): AuthorizerResponse {
    return false
  }

  update(loggedInUser: User, user: User): AuthorizerResponse {
    return loggedInUser.id === user.id
  }

  destroy(loggedInUser: User, user: User): AuthorizerResponse {
    return loggedInUser.id === user.id
  }
}
