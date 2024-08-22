import vine from '@vinejs/vine'

export const bookValidator = vine.compile(
  vine.object({
    author: vine.string(),
    title: vine.string(),
    description: vine.string(),
    available: vine.boolean(),
  })
)
