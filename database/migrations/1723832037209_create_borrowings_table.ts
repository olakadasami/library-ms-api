import { BaseSchema } from '@adonisjs/lucid/schema'
import BorrowStatus from '../../app/enums/borrow_status.js'

export default class extends BaseSchema {
  protected tableName = 'borrowings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').notNullable()
      table.integer('book_id').unsigned().references('books.id').notNullable()

      table.integer('status').notNullable().defaultTo(BorrowStatus.ACTIVE)

      table.timestamp('due_date').notNullable()
      table.timestamp('return_date').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
