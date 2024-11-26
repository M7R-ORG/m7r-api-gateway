import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app.config';
import { json, urlencoded } from 'express';

const limit = '50mb';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const configService = app.get(ConfigService);
  const { port, allowedOrigins } = configService.get<AppConfig>('app');

  app.use(json({ limit }));
  app.use(urlencoded({ extended: true, limit }));
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  await app.listen(port);
}
bootstrap();
