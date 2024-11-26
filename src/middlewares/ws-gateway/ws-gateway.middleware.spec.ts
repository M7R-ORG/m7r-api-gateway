import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { WSProxyMiddleware } from './ws-gateway.middleware';

jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: jest.fn(() => jest.fn()),
}));

describe('WSProxyMiddleware', () => {
  let middleware: WSProxyMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WSProxyMiddleware,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    middleware = module.get<WSProxyMiddleware>(WSProxyMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
