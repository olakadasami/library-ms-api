import vine from '@vinejs/vine'

export const profileUpdateValidator = vine.compile(
  vine.object({
    avatar: vine.file({ extnames: ['jpg', 'png', 'jpeg'], size: '5mb' }).optional(),
    avatarUrl: vine.string().optional(),
    bio: vine.string().optional(),
    phone: vine.string().optional(),
    address: vine.string().optional(),
    fullName: vine.string().optional(),
  })
)
