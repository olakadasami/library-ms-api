import factory from '@adonisjs/lucid/factories'
import Genre from '#models/genre'

export const GenreFactory = factory
  .define(Genre, async ({ faker }) => {
    return {
      name: faker.music.genre(),
    }
  })
  .build()
