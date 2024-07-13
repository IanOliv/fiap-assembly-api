import ConfirmPayment from '@/core/application/usecase/pedido/confirmPayment.use-case'
import Consumidor from '@/core/domain/entities/consumidor'
import Pedido from '@/core/domain/entities/pedido'
import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'
import BusinessException from '@/core/domain/errors/business-exception'
import IPedidoRepository from '@/core/domain/repositories/ipedido.repository'
import IAssemblyService from '@/core/domain/services/iassembly.service'
import { AssemblyGateway } from '@/core/operation/gateway/assembly.gateway'
import { PedidoGateway } from '@/core/operation/gateway/pedido.gateway'

describe('ConfirmPayment Class Tests', () => {
  let mockPedidoGateway:PedidoGateway
  let mockAssemblyGateway:AssemblyGateway
  let useCase:ConfirmPayment
  let mockPedidoRepository:jest.Mocked<IPedidoRepository>
  let mockAssemblyService:jest.Mocked<IAssemblyService>

  let mockCreate:jest.Mock<any>
  let mockfindById:jest.Mock<any>
  let mockList:jest.Mock<any>
  let mocksave:jest.Mock<any>
  let mockRegisterOrder:jest.Mock<any>

  beforeEach(() => {
    jest.mock('@/core/operation/gateway/assembly.gateway')
    jest.mock('@/core/operation/gateway/pedido.gateway')

    mockCreate = jest.fn()
    mockfindById = jest.fn()
    mockList = jest.fn()
    mocksave = jest.fn()
    mockRegisterOrder = jest.fn()

    PedidoGateway.prototype.create = mockCreate
    PedidoGateway.prototype.findById = mockfindById
    PedidoGateway.prototype.list = mockList
    PedidoGateway.prototype.save = mocksave

    AssemblyGateway.prototype.registerOrder = mockRegisterOrder

    mockAssemblyService = {
      registerOrder: jest.fn()
    }

    mockPedidoRepository = {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      save: jest.fn()
    }

    mockPedidoGateway = new PedidoGateway(mockPedidoRepository)
    mockAssemblyGateway = new AssemblyGateway(mockAssemblyService)
    useCase = new ConfirmPayment(mockPedidoGateway, mockAssemblyGateway)
  })

  it('constructor class test', async () => {
    expect(useCase).toBeInstanceOf(ConfirmPayment)
  })

  it('test handle method using not available pedido', async () => {
    mockfindById.mockResolvedValue(undefined)
    await expect(useCase.handle(1)).rejects.toThrow(new BusinessException('Pedido não encontrado'))
  })

  it('test handle method using pedido status equal PedidoStatusEnum.PREPARACAO', async () => {
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

    mockfindById.mockResolvedValue(pedido)
    await expect(useCase.handle(1)).rejects.toThrow(new BusinessException('Pedido não está com pagamento pendente'))
  })

  it('test handle method using pedido status equal PedidoStatusEnum.PRONTO', async () => {
    const consumidor = Consumidor.create('Test', '26055706571', 'test@test.com')

    const pedido = new Pedido({
      id: 1,
      consumidorId: '1',
      consumidor,
      itens: [],
      total: 1,
      status: PedidoStatusEnum.PRONTO,
      pagamentoId: '',
      createdAt: new Date(1),
      updatedAt: new Date(1)
    })

    mockfindById.mockResolvedValue(pedido)
    await expect(useCase.handle(1)).rejects.toThrow(new BusinessException('Pedido não está com pagamento pendente'))
  })

  it('test handle method using pedido status equal PedidoStatusEnum.FINALIZADO', async () => {
    const consumidor = Consumidor.create('Test', '26055706571', 'test@test.com')

    const pedido = new Pedido({
      id: 1,
      consumidorId: '1',
      consumidor,
      itens: [],
      total: 1,
      status: PedidoStatusEnum.FINALIZADO,
      pagamentoId: '',
      createdAt: new Date(1),
      updatedAt: new Date(1)
    })

    mockfindById.mockResolvedValue(pedido)
    await expect(useCase.handle(1)).rejects.toThrow(new BusinessException('Pedido não está com pagamento pendente'))
  })

  it('test handle method using pedido status equal PedidoStatusEnum.RECEBIDO', async () => {
    const consumidor = Consumidor.create('Test', '26055706571', 'test@test.com')

    const pedido = new Pedido({
      id: 1,
      consumidorId: '1',
      consumidor,
      itens: [],
      total: 1,
      status: PedidoStatusEnum.RECEBIDO,
      pagamentoId: '',
      createdAt: new Date(1),
      updatedAt: new Date(1)
    })

    mockfindById.mockResolvedValue(pedido)
    mocksave.mockResolvedValue(pedido)

    const result = await useCase.handle(1)

    expect(mockfindById).toHaveBeenCalledTimes(1)
    expect(mocksave).toHaveBeenCalledTimes(1)

    expect(mockfindById).toHaveBeenCalledWith(1)
    expect(mocksave).toHaveBeenCalledWith(pedido)

    expect(result).toEqual(pedido)
  })

  it('test handle method using pedido status equal PedidoStatusEnum.PAGAMENTO_PENDENTE', async () => {
    const consumidor = Consumidor.create('Test', '26055706571', 'test@test.com')

    const pedido = new Pedido({
      id: 1,
      consumidorId: '1',
      consumidor,
      itens: [],
      total: 1,
      status: PedidoStatusEnum.PAGAMENTO_PENDENTE,
      pagamentoId: '',
      createdAt: new Date(1),
      updatedAt: new Date(1)
    })

    mockfindById.mockResolvedValue(pedido)
    mocksave.mockResolvedValue(pedido)

    const result = await useCase.handle(1)

    pedido.status = PedidoStatusEnum.RECEBIDO

    expect(mockfindById).toHaveBeenCalledTimes(1)
    expect(mocksave).toHaveBeenCalledTimes(1)
    expect(mockfindById).toHaveBeenCalledWith(1)
    expect(mocksave).toHaveBeenCalledWith(pedido)
    expect(result).toEqual(pedido)
  })
})
