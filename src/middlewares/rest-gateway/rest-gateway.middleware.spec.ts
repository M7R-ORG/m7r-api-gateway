import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RestProxyMiddleware } from './rest-gateway.middleware';

jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: jest.fn(() => jest.fn()),
}));

describe('RestProxyMiddleware', () => {
  let middleware: RestProxyMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestProxyMiddleware,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    middleware = module.get<RestProxyMiddleware>(RestProxyMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
