import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TimerMiddleware implements NestMiddleware {
  private logger = new Logger(TimerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const start = performance.now();

    res.on('finish', () => {
      const duration = (performance.now() - start).toFixed(2);
      this.logger.log(
        `Request {${req.url}, ${req.method}} completed in ${duration}ms`,
      );
    });

    next();
  }
}
