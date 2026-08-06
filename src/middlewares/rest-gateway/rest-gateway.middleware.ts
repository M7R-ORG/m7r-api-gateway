import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Response } from 'express';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import { ClientRequest } from 'http';
import { JwtService } from '../../jwt/jwt.service';
import { RequestWithIdentity } from './rest-gateway.types';
import {
  ACCOUNT_ID_HEADER,
  ACCOUNT_ROLE_HEADER,
  IDENTITY_HEADERS,
} from '../../common/common.constants';

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
        proxyReq: (proxyReq: ClientRequest, req: RequestWithIdentity) => {
          const payload = req.jwtPayload;

          if (payload) {
            proxyReq.setHeader(ACCOUNT_ID_HEADER, String(payload.id));
            proxyReq.setHeader(ACCOUNT_ROLE_HEADER, String(payload.role));
          }

          const contentType = req.headers['content-type'] || '';
          const isMultipart = contentType.startsWith('multipart/');

          if (req.body && !isMultipart) {
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

  use(req: RequestWithIdentity, res: Response, next: NextFunction) {
    for (const header of IDENTITY_HEADERS) {
      delete req.headers[header];
    }

    req.jwtPayload = this.jwt.getPayload(req.headers.authorization);

    this.proxy(req, res, next);
  }
}
