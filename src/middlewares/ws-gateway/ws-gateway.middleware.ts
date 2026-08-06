import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Response } from 'express';
import { ClientRequest } from 'http';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import { JwtService } from '../../jwt/jwt.service';
import {
  ACCOUNT_ID_HEADER,
  ACCOUNT_ROLE_HEADER,
  IDENTITY_HEADERS,
} from '../../common/common.constants';
import { RequestWithIdentity } from '../rest-gateway/rest-gateway.types';

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
        proxyReqWs: (proxyReq: ClientRequest, req: RequestWithIdentity) => {
          const payload = req.jwtPayload;

          if (payload) {
            proxyReq.setHeader(ACCOUNT_ID_HEADER, String(payload.id));
            proxyReq.setHeader(ACCOUNT_ROLE_HEADER, String(payload.role));
          }
        },
      },
    });
  }

  use(req: RequestWithIdentity, res: Response, next: NextFunction) {
    for (const header of IDENTITY_HEADERS) {
      delete req.headers[header];
    }

    const payload = this.jwt.getPayload(req.headers.authorization);

    if (payload) {
      req.jwtPayload = payload;
    }

    this.proxy(req, res, next);
  }
}
