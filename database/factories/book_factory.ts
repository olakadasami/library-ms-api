import factory from '@adonisjs/lucid/factories'
import Book from '#models/book'

export const BookFactory = factory
  .define(Book, async ({ faker }) => {
    return {
      title: faker.music.songName(),
      author: faker.person.fullName(),
      description: faker.person.bio(),
    }
  })
  .build()
