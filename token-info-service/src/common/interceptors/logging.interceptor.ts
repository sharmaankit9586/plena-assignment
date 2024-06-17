import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('TokenInfoService');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const keyUsed = request.query.key || 'N/A'; // Assuming key is in query string

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const timestamp = Date.now() - now;
        this.logger.log(`Key: ${keyUsed} | Timestamp: ${timestamp}ms | Status: Success`);
      }),
    );
  }
}
