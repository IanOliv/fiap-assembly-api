import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiProperty } from '@nestjs/swagger'

class HealthCheck {
  @ApiProperty({ description: 'Health check status', enum: ['ok', 'error'], example: 'ok' })
  status: 'ok' | 'error'
}

@Controller()
export default class AppController {
  constructor () { }

  @Get()
  @ApiOperation({ summary: 'API index endpoint' })
  @ApiOkResponse({ description: 'API index endpoint', type: 'iRango Order API' })
  app (): string {
    return 'iRango Order API'
  }

  @Get('/health-check')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiOkResponse({ description: 'Retorna o status da saúde do sistema', type: HealthCheck })
  healthCheck (): HealthCheck {
    return { status: 'ok' }
  }
}
