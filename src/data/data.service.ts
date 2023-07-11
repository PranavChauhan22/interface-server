import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service';


@Injectable()
export class DataService {
  constructor(private readonly appService: AppService) {}

  async fetchData(id: string): Promise<any> {
    try {
      const response = await this.appService.fetchData(id);

      return response;
    } catch (error) {
    console.log(error);
      throw new Error('Failed to fetch data');
    }
  }
}
