import { IAError } from "../index";

export class ApplicationException extends Error implements IAError {
    constructor(
        message: string,
        public status: number,
        cause?: unknown,
    ) {
        super(message, { cause });
    }
}

export class BadRequestException extends ApplicationException {
    constructor(message: string = "Bad request", cause?: unknown) {
        super(message, 400, cause);
    }
}

export class UnauthorizedException extends ApplicationException {
    constructor(message: string = "Unauthorized", cause?: unknown) {
        super(message, 401, cause);
    }
}

export class ForbiddenException extends ApplicationException {
    constructor(message: string = "Forbidden", cause?: unknown) {
        super(message, 403, cause);
    }
}

export class NotFoundException extends ApplicationException {
    constructor(message: string = "Resource not found", cause?: unknown) {
        super(message, 404, cause);
    }
}

export class ConflictException extends ApplicationException {
    constructor(message: string = "Conflict occurred", cause?: unknown) {
        super(message, 409, cause);
    }
}

export class TooManyRequestsException extends ApplicationException {
    constructor(message: string = "Too many requests", cause?: unknown) {
        super(message, 429, cause);
    }
}

export class InternalServerErrorException extends ApplicationException {
    constructor(message: string = "Internal server error", cause?: unknown) {
        super(message, 500, cause);
    }
}