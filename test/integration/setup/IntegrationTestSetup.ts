/* eslint-disable @typescript-eslint/no-explicit-any */

import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { agent } from 'supertest'

import { IPaymentService } from '@/core/domain/services/ipayment.service'
import AllExceptionFilter from '@/core/helpers/AllExceptionFilter'
import ResponseTransformInterceptor from '@/core/helpers/ResponseTransformInterceptor'
import IRangoPaymentService from '@/infra/persistence/service/irango-payment.service'
import AppModule, { appModules } from '@/infra/web/nestjs/app.module'

import FactoryUtils from '@/test/integration/setup/utils/FactoryUtils'
import { ServerUtils } from '@/test/integration/setup/utils/ServerUtils'
import { TestDatabaseUtils } from '@/test/integration/setup/utils/TestDatabaseUtils'

export interface ITestSetup {
  app: INestApplication
  module: TestingModule
  db: TestDatabaseUtils
  factory: FactoryUtils
  server: ServerUtils
}

const paymentService: Partial<IRangoPaymentService> = { registerOrder: jest.fn() }

const buildNestApp = async () => {
  const module = await Test.createTestingModule({
    imports: [
      ...appModules,
      AppModule,
      // TypeOrmModule.forRoot(TypeOrmTestConfig),
    ],
    providers: [
      TestDatabaseUtils,
      FactoryUtils
    ]
  })
    .overrideProvider(IPaymentService)
    .useValue(paymentService)
    .compile()

  module.useLogger({
    log (): any {},
    error (): any {},
    warn (): any {},
    debug (): any {},
    verbose (): any {}
  })

  const app = module.createNestApplication()

  app.useGlobalInterceptors(new ResponseTransformInterceptor())
  app.useGlobalFilters(new AllExceptionFilter())
  app.useGlobalPipes(new ValidationPipe())

  return {
    app,
    module
  }
}

export class IntegrationTestSetup {
  private static instance: Promise<ITestSetup> | undefined = undefined
  private constructor () {}

  public static getInstance (): Promise<ITestSetup> {
    if (!IntegrationTestSetup.instance) {
      IntegrationTestSetup.instance = this.buildInstance()
    }
    return IntegrationTestSetup.instance
  }

  private static async buildInstance (): Promise<ITestSetup> {
    const { app, module } = await buildNestApp()
    const db = module.get<TestDatabaseUtils>(TestDatabaseUtils)
    const factory = module.get<FactoryUtils>(FactoryUtils)
    const server = new ServerUtils(agent(app.getHttpServer()))

    return {
      app,
      module,
      db,
      factory,
      server
    }
  }
}

export default IntegrationTestSetup
