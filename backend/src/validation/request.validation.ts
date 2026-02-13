import {email, z} from 'zod'

 

export const urlShortenBodySchema = z.object({
    url:z.string().url(),
    code : z.string().optional()
})