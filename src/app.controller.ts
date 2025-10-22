import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app')  
@Controller()
export class AppController {

  @Get('health')
  getHealthStatus() {
    return { status: 'ok', message: 'API is running smoothly' };
  }

  @Get('info')
  getAppInfo() {
    return {
      name: 'String Analyzer API',
      version: '1.0.0',
      description: 'An API that analyzes strings and stores their computed properties.',
    };
  }
}
