import vine from '@vinejs/vine'

export const borrowValidator = vine.compile(
  vine.object({
    bookId: vine.number().exists(async (db, value) => {
      const book = await db
        .from('books')
        //   .whereNot('id', field.meta.userId)
        .where('id', value)
        .first()
      return book
    }),
    userId: vine.number().exists(async (db, value) => {
      const user = await db
        .from('users')
        //   .whereNot('id', field.meta.userId)
        .where('id', value)
        .first()
      return user
    }),
  })
)
