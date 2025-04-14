export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Ресурс не найден') {
    super(404, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Не авторизован') {
    super(401, message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Неверный запрос') {
    super(400, message);
  }
} 