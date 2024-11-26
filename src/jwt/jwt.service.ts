import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify, VerifyOptions } from 'jsonwebtoken';
import * as crypto from 'crypto';
import { jwtPayloadKey } from './jwt.constants';
import { JwtPayloadT } from './jwt.types';
import { AuthConfig } from 'src/config/app.config';

@Injectable()
export class JwtService {
  constructor(private readonly config: ConfigService) {}

  private getHashedSecretKey(): Buffer {
    const secretKey = this.config.get<string>('auth.secret');
    return crypto.createHash('sha512').update(secretKey).digest();
  }

  getPayload(token: string): JwtPayloadT {
    try {
      const verifyOptions = this.config.get<AuthConfig>('auth');

      const adaptedToken = token.startsWith('Bearer ')
        ? token.split(' ')[1]
        : token;

      const hashedSecretKey = this.getHashedSecretKey();

      const decoded = verify(
        adaptedToken,
        hashedSecretKey,
        verifyOptions as VerifyOptions,
      );

      return {
        id: decoded[jwtPayloadKey.id],
        role: decoded[jwtPayloadKey.role],
      };
    } catch (err) {
      return null;
    }
  }
}
