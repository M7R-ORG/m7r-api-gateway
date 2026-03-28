import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { WSProxyMiddleware } from './ws-gateway.middleware';
import { JwtModule } from '../../jwt/jwt.module';

jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: jest.fn(() => jest.fn()),
}));

describe('WSProxyMiddleware', () => {
  let middleware: WSProxyMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [WSProxyMiddleware],
    }).compile();

    middleware = module.get<WSProxyMiddleware>(WSProxyMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
