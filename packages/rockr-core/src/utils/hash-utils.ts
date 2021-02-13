import * as crypto from 'crypto'

export const generateUniqueId = (): string => {
    const current = Date.now().toString()
    const random = Math.random().toString()
    return crypto.createHash('sha1').update(current + random).digest('hex')
}

