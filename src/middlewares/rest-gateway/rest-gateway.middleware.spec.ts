import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { RestProxyMiddleware } from './rest-gateway.middleware';
import { JwtModule } from '../../jwt/jwt.module';

jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: jest.fn(() => jest.fn()),
}));

describe('RestProxyMiddleware', () => {
  let middleware: RestProxyMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [RestProxyMiddleware],
    }).compile();

    middleware = module.get<RestProxyMiddleware>(RestProxyMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
