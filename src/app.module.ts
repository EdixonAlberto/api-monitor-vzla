import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { MonitorDolarModule } from './modules/monitor-dolar/monitor-dolar.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MonitorDolarModule]
})
export class AppModule {
  public static port: number

  constructor(private readonly config: ConfigService) {
    AppModule.port = Number(this.config.get<string>('PORT'))
  }
}
