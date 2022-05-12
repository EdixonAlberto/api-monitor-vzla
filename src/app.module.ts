import { Module } from '@nestjs/common'

import { MonitorDollarModule } from './modules/monitor-dollar/monitor-dollar.module'

@Module({
  imports: [MonitorDollarModule]
})
export class AppModule {}
