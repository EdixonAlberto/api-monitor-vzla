import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { MonitorDolarModule } from './modules/monitor-dolar/monitor-dolar.module'
import { DolarTodayModule } from './modules/dolar-today/dolar-today.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MonitorDolarModule, DolarTodayModule]
})
export class AppModule {
  public static port: number

  constructor(private readonly config: ConfigService) {
    AppModule.port = Number(this.config.get<string>('PORT'))
  }
}
