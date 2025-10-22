import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response =
        (exception.getResponse() as Record<string, unknown>) || {};
      return res.status(status).json({
        statusCode: status,
        error: response['error'] ?? HttpStatus[status],
        message: response['message'] ?? exception.message,
        timestamp: new Date().toISOString(),
      });
    }

    // Fallback
    // eslint-disable-next-line no-console
    console.error('Unhandled error:', exception);
    return res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    });
  }
}
