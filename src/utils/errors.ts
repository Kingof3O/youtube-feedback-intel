export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, code: string, statusCode = 500, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class YouTubeApiError extends AppError {
  public readonly httpStatus: number;

  constructor(message: string, httpStatus: number) {
    super(message, 'YOUTUBE_API_ERROR', httpStatus);
    this.name = 'YouTubeApiError';
    this.httpStatus = httpStatus;
    Object.setPrototypeOf(this, YouTubeApiError.prototype);
  }

  get isRateLimited(): boolean {
    return this.httpStatus === 429;
  }

  get isServerError(): boolean {
    return this.httpStatus >= 500;
  }

  get isRetryable(): boolean {
    return this.isRateLimited || this.isServerError;
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 'DATABASE_ERROR', 500);
    this.name = 'DatabaseError';
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class ConfigError extends AppError {
  constructor(message: string) {
    super(message, 'CONFIG_ERROR', 500);
    this.name = 'ConfigError';
    Object.setPrototypeOf(this, ConfigError.prototype);
  }
}
