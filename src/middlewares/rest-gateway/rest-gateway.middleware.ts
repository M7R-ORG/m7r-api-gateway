import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import { ClientRequest } from 'http';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class RestProxyMiddleware implements NestMiddleware {
  private proxy: RequestHandler;

  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {
    const router = this.config.get<Record<string, string>>('router.api');

    this.proxy = createProxyMiddleware({
      changeOrigin: true,
      router,
      pathRewrite: (path) => path.replace(/^\/api\/[^\/]+/, '/api'),
      on: {
        proxyReq: (proxyReq: ClientRequest, req: Request) => {
          const accessToken = req.headers.authorization;
          const jwtPayload = this.jwt.getPayload(accessToken);

          if (jwtPayload) {
            proxyReq.setHeader('x-account-id', jwtPayload?.id);
            proxyReq.setHeader('x-account-role', jwtPayload?.role);
          }

          if (req.body) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
          }
        },
        error: (error) => {
          console.error(error);
        },
      },
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.proxy(req, res, next);
  }
}
