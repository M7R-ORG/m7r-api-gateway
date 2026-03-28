import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/app.config';
import { RestProxyMiddleware } from './middlewares/rest-gateway/rest-gateway.middleware';
import { WSProxyMiddleware } from './middlewares/ws-gateway/ws-gateway.middleware';
import { TimerMiddleware } from './middlewares/timer.middleware';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    JwtModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
  ],
})
export class ApiGatewayModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TimerMiddleware)
      .forRoutes('*')
      .apply(RestProxyMiddleware)
      .forRoutes({ path: '/api/*', method: RequestMethod.ALL })
      .apply(WSProxyMiddleware)
      .forRoutes({ path: '/signalR/*', method: RequestMethod.ALL });
  }
}
