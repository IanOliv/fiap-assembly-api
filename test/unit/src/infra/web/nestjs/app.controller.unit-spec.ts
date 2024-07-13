import AppController from '@/infra/web/nestjs/app.controller'

describe('Test for app controller class', () => {
  let controller:AppController

  beforeEach(() => {
    controller = new AppController()
  })

  it('test constructor', () => {
    expect(controller).toBeInstanceOf(AppController)
  })

  it('test app method', () => {
    expect(controller.app()).toEqual('iRango Order API')
  })

  it('test healthCheck method', () => {
    expect(controller.healthCheck()).toEqual({ status: 'ok' })
  })
})
