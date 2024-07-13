import List from '@/core/application/usecase/pedido/list.use-case'
import Consumidor from '@/core/domain/entities/consumidor'
import Pedido from '@/core/domain/entities/pedido'
import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'
import IPedidoRepository from '@/core/domain/repositories/ipedido.repository'
import { PedidoGateway } from '@/core/operation/gateway/pedido.gateway'

describe('List Class Tests', () => {
  let mockPedidoGateway:PedidoGateway
  let useCase:List
  let mockPedidoRepository:jest.Mocked<IPedidoRepository>

  let mockCreate:jest.Mock<any>
  let mockfindById:jest.Mock<any>
  let mockList:jest.Mock<any>
  let mocksave:jest.Mock<any>

  beforeEach(() => {
    jest.mock('@/core/operation/gateway/pedido.gateway')

    mockCreate = jest.fn()
    mockfindById = jest.fn()
    mockList = jest.fn()
    mocksave = jest.fn()

    PedidoGateway.prototype.create = mockCreate
    PedidoGateway.prototype.findById = mockfindById
    PedidoGateway.prototype.list = mockList
    PedidoGateway.prototype.save = mocksave

    mockPedidoRepository = {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      save: jest.fn()
    }

    mockPedidoGateway = new PedidoGateway(mockPedidoRepository)
    useCase = new List(mockPedidoGateway)
  })

  it('constructor class test', async () => {
    expect(useCase).toBeInstanceOf(List)
  })

  it('test handle method', async () => {
    const consumidor = Consumidor.create('Test', '26055706571', 'test@test.com')

    const pedido = new Pedido({
      id: 1,
      consumidorId: '1',
      consumidor,
      itens: [],
      total: 1,
      status: PedidoStatusEnum.PREPARACAO,
      pagamentoId: '',
      createdAt: new Date(1),
      updatedAt: new Date(1)
    })

    mockList.mockResolvedValue([pedido])

    const result = await useCase.handle()

    expect(mockList).toHaveBeenCalledTimes(1)
    expect(result).toEqual([pedido])
  })
})
