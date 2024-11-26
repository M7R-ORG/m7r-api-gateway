import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/app.config';
import { RestProxyMiddleware } from './middlewares/rest-gateway/rest-gateway.middleware';
import { WSProxyMiddleware } from './middlewares/ws-gateway/ws-gateway.middleware';
import { TimerMiddleware } from './middlewares/timer.middleware';
import { JwtService } from './jwt/jwt.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] })],
  providers: [JwtService],
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
