import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DataController } from './data/data.controller';
import { DataService } from './data/data.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [DataController],
  providers: [DataService,AppService],
})
export class AppModule {}
