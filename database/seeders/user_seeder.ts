import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  static environment = ['development', 'testing']
  async run() {
    // Write your database queries inside the run method
    await UserFactory.createMany(2)

    // create test admin
    await User.create({
      roleId: 3,
      username: 'admin',
      email: 'admin@test.com',
      password: 'admin-password',
    })

    // create test moderator
    await User.create({
      roleId: 2,
      username: 'moderator',
      email: 'moderator@test.com',
      password: 'moderator-password',
    })
  }
}
