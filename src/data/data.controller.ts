
import { Controller, Get, Param, Headers } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get(':id')
  async getData(@Param('id') id: string) {
    return this.dataService.fetchData(id);
  }
}

