// libs/server/workbench-api/shared/src/lib/errors.ts

export class HttpError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

export function toErrorResponse(err: unknown): {
  statusCode: number;
  body: { error: string };
} {
  if (err instanceof HttpError) {
    return {
      statusCode: err.statusCode,
      body: { error: err.message },
    };
  }
  return {
    statusCode: 500,
    body: { error: 'Internal Server Error' },
  };
}
