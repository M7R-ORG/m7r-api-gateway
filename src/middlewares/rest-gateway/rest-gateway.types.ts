import { Request } from 'express';
import { JwtPayloadT } from '../../jwt/jwt.types';

export type RequestWithIdentity = Request & {
  jwtPayload?: JwtPayloadT | null;
};
