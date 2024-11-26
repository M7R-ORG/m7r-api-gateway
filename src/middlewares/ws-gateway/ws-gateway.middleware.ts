import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { ClientRequest } from 'http';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class WSProxyMiddleware implements NestMiddleware {
  private proxy: RequestHandler;

  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {
    const router = this.config.get<Record<string, string>>('router.ws');

    this.proxy = createProxyMiddleware({
      changeOrigin: true,
      ws: true,
      router,
      pathRewrite: (path) => path.replace(/^\/signalR\/[^\/]+/, '/signalR'),
      on: {
        proxyReqWs: (proxyReq: ClientRequest, req: Request) => {
          const accessToken = req.headers.authorization;
          const jwtPayload = this.jwt.getPayload(accessToken);

          if (jwtPayload) {
            proxyReq.setHeader('x-account-id', jwtPayload?.id);
            proxyReq.setHeader('x-account-role', jwtPayload?.role);
          }
        },
      },
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.proxy(req, res, next);
  }
}
