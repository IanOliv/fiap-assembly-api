import Pedido from '@/core/domain/entities/pedido'
import IAssemblyService from '@/core/domain/services/iassembly.service'
import { AssemblyGateway } from '@/core/operation/gateway/assembly.gateway'

describe('Test AssemblyGateway class', () => {
  let gateway: AssemblyGateway
  let mockedAssemblyService: jest.Mocked<IAssemblyService>

  beforeEach(() => {
    mockedAssemblyService = {
      registerOrder: jest.fn()
    }

    gateway = new AssemblyGateway(mockedAssemblyService)
  })

  it('Testing class constructor', () => {
    expect(gateway).toBeInstanceOf(AssemblyGateway)
  })

  it('Test registerOrder method', async () => {
    const pedido = new Pedido()

    mockedAssemblyService.registerOrder.mockResolvedValue()

    await gateway.registerOrder(pedido)

    expect(mockedAssemblyService.registerOrder).toHaveBeenCalledWith(pedido)
    expect(mockedAssemblyService.registerOrder).toHaveBeenCalledTimes(1)
  })
})
