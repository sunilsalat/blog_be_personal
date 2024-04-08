import { BaseError } from './baseError'

export class NotFound extends BaseError {
    statusCode: number = 404
    constructor(message: string) {
        super(message)
    }

    serializeErrors(): { message: string; field?: string | undefined }[] {
        return [{ message: this.message }]
    }
}
