import ConfirmPayment from '@/core/application/usecase/pedido/confirmPayment.use-case'
import Create from '@/core/application/usecase/pedido/create.use-case'
import FindById from '@/core/application/usecase/pedido/findById.use-case'
import FinishAssembly from '@/core/application/usecase/pedido/finishAssembly.use-case'
import List from '@/core/application/usecase/pedido/list.use-case'
import StartAssembly from '@/core/application/usecase/pedido/startAssembly.use-case'
import Update from '@/core/application/usecase/pedido/update.use-case'
import ConsumidorDto from '@/core/domain/dto/output/consumidor.dto'
import PedidoDto from '@/core/domain/dto/output/pedido.dto'
import Consumidor from '@/core/domain/entities/consumidor'
import Pedido from '@/core/domain/entities/pedido'
import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'
import PedidoMapper from '@/core/domain/mappers/pedido.mapper'
import IConsumidorRepository from '@/core/domain/repositories/iconsumidor.repository'
import IPedidoRepository from '@/core/domain/repositories/ipedido.repository'
import IProdutoRepository from '@/core/domain/repositories/iproduto.repository'
import IPaymentService from '@/core/domain/services/ipayment.service'
import { PedidoController } from '@/core/operation/controllers/pedido.controller'
import { AssemblyGateway } from '@/core/operation/gateway/assembly.gateway'
import { ConsumidorGateway } from '@/core/operation/gateway/consumidor.gateway'
import { PaymentGateway } from '@/core/operation/gateway/payment.gateway'
import { PedidoGateway } from '@/core/operation/gateway/pedido.gateway'
import { ProdutoGateway } from '@/core/operation/gateway/produto.gateway'
import IRangoAssemblyService from '@/infra/persistence/service/irango-assembly.service'
import CreatePedidoRequest from '@/infra/web/nestjs/pedidos/dto/create-pedido.request'
import UpdatePedidoRequest from '@/infra/web/nestjs/pedidos/dto/update-pedido.request'

describe('Test for PedidoController Class', () => {
  let controller:PedidoController

  let mockPedidoRepository:jest.Mocked<IPedidoRepository>
  let mockConsumidorRepository:jest.Mocked<IConsumidorRepository>
  let mockProdutoRepository:jest.Mocked<IProdutoRepository>
  let mockPaymentService:jest.Mocked<IPaymentService>
  let mockAssemblyService:jest.Mocked<IRangoAssemblyService>

  let mockPedidoGatewayCreate:jest.Mock<any>
  let mockPedidoGatewayfindById:jest.Mock<any>
  let mockPedidoGatewayList:jest.Mock<any>
  let mockPedidoGatewaysave:jest.Mock<any>

  let mockProdutoGatewayCreate:jest.Mock<any>
  let mockProdutoGatewayfindById:jest.Mock<any>
  let mockProdutoGatewayfindByCategoria:jest.Mock<any>
  let mockProdutoGatewaysave:jest.Mock<any>
  let mockProdutoGatewayfind:jest.Mock<any>

  let mockConsumidorGatewayCreate:jest.Mock<any>
  let mockConsumidorGatewayfindById:jest.Mock<any>
  let mockConsumidorGatewayfindByCpf:jest.Mock<any>
  let mockConsumidorGatewaysave:jest.Mock<any>
  let mockConsumidorGatewayfind:jest.Mock<any>

  let mockPaymentGatewayRegisterOrder:jest.Mock<any>

  let mockAssemblyGatewayRegisterOrder:jest.Mock<any>

  let mockCreateUseCaseHandle:jest.Mock<any>
  let mockUpdateUseCaseHandle:jest.Mock<any>
  let mockConfirmPaymentUseCaseHandle:jest.Mock<any>
  let mockStartAssemblyUseCaseHandle:jest.Mock<any>
  let mockFinishAssemblyUseCaseHandle:jest.Mock<any>
  let mockFindByIdUseCaseHandle:jest.Mock<any>
  let mockListUseCaseHandle:jest.Mock<any>

  let mockToDto:jest.Mock<any>
  let mockToDomainEntity:jest.Mock<any>

  beforeEach(() => {
    jest.mock('@/core/operation/gateway/consumidor.gateway')
    jest.mock('@/core/operation/gateway/assembly.gateway')
    jest.mock('@/core/operation/gateway/payment.gateway')
    jest.mock('@/core/operation/gateway/pedido.gateway')
    jest.mock('@/core/operation/gateway/produto.gateway')

    jest.mock('@/core/application/usecase/pedido/confirmPayment.use-case')
    jest.mock('@/core/application/usecase/pedido/create.use-case')
    jest.mock('@/core/application/usecase/pedido/findById.use-case')
    jest.mock('@/core/application/usecase/pedido/finishAssembly.use-case')
    jest.mock('@/core/application/usecase/pedido/list.use-case')
    jest.mock('@/core/application/usecase/pedido/startAssembly.use-case')
    jest.mock('@/core/application/usecase/pedido/update.use-case')

    mockPedidoGatewayCreate = jest.fn()
    mockPedidoGatewayfindById = jest.fn()
    mockPedidoGatewayList = jest.fn()
    mockPedidoGatewaysave = jest.fn()

    mockProdutoGatewayCreate = jest.fn()
    mockProdutoGatewayfindById = jest.fn()
    mockProdutoGatewayfindByCategoria = jest.fn()
    mockProdutoGatewaysave = jest.fn()
    mockProdutoGatewayfind = jest.fn()

    mockConsumidorGatewayCreate = jest.fn()
    mockConsumidorGatewayfindById = jest.fn()
    mockConsumidorGatewayfindByCpf = jest.fn()
    mockConsumidorGatewaysave = jest.fn()
    mockConsumidorGatewayfind = jest.fn()

    mockPaymentGatewayRegisterOrder = jest.fn()

    mockCreateUseCaseHandle = jest.fn()
    mockUpdateUseCaseHandle = jest.fn()
    mockConfirmPaymentUseCaseHandle = jest.fn()
    mockStartAssemblyUseCaseHandle = jest.fn()
    mockFinishAssemblyUseCaseHandle = jest.fn()
    mockFindByIdUseCaseHandle = jest.fn()
    mockListUseCaseHandle = jest.fn()

    mockToDto = jest.fn()
    mockToDomainEntity = jest.fn()

    PedidoGateway.prototype.create = mockPedidoGatewayCreate
    PedidoGateway.prototype.findById = mockPedidoGatewayfindById
    PedidoGateway.prototype.list = mockPedidoGatewayList
    PedidoGateway.prototype.save = mockPedidoGatewaysave

    ProdutoGateway.prototype.create = mockProdutoGatewayCreate
    ProdutoGateway.prototype.findById = mockProdutoGatewayfindById
    ProdutoGateway.prototype.findByCategoria = mockProdutoGatewayfindByCategoria
    ProdutoGateway.prototype.save = mockProdutoGatewaysave
    ProdutoGateway.prototype.find = mockProdutoGatewayfind

    ConsumidorGateway.prototype.create = mockConsumidorGatewayCreate
    ConsumidorGateway.prototype.find = mockConsumidorGatewayfind
    ConsumidorGateway.prototype.findById = mockConsumidorGatewayfindById
    ConsumidorGateway.prototype.findByCPF = mockConsumidorGatewayfindByCpf
    ConsumidorGateway.prototype.save = mockConsumidorGatewaysave

    PaymentGateway.prototype.registerOrder = mockPaymentGatewayRegisterOrder

    AssemblyGateway.prototype.registerOrder = mockAssemblyGatewayRegisterOrder

    Create.prototype.handle = mockCreateUseCaseHandle
    Update.prototype.handle = mockUpdateUseCaseHandle
    ConfirmPayment.prototype.handle = mockConfirmPaymentUseCaseHandle
    StartAssembly.prototype.handle = mockStartAssemblyUseCaseHandle
    FinishAssembly.prototype.handle = mockFinishAssemblyUseCaseHandle
    FindById.prototype.handle = mockFindByIdUseCaseHandle
    List.prototype.handle = mockListUseCaseHandle

    PedidoMapper.toDto = mockToDto
    PedidoMapper.toDomainEntity = mockToDomainEntity

    mockPedidoRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      find: jest.fn()
    }

    mockConsumidorRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCPF: jest.fn(),
      save: jest.fn(),
      find: jest.fn()
    }

    mockPaymentService = {
      registerOrder: jest.fn()
    }

    mockAssemblyService = {
      registerOrder: jest.fn()
    }

    mockProdutoRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCategoria: jest.fn(),
      save: jest.fn(),
      find: jest.fn()
    }

    controller = new PedidoController(
      mockPedidoRepository,
      mockConsumidorRepository,
      mockProdutoRepository,
      mockPaymentService,
      mockAssemblyService
    )
  })

  it('constructor class test', async () => {
    expect(controller).toBeInstanceOf(PedidoController)
  })

  it('list method test', async () => {
    const consumidor_dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    const dto: PedidoDto = {
      id: 1,
      consumidorId: '1',
      consumidor: consumidor_dto,
      total: 1,
      itens: [],
      status: PedidoStatusEnum.PREPARACAO,
      pagamentoId: '',
      createdAt: new Date(1),
      updatedAt: new Date(1)
    }

    const pedido:Pedido = Pedido.create(
      consumidor,
      [],
      PedidoStatusEnum.PREPARACAO
    )

    mockListUseCaseHandle.mockResolvedValue([pedido])
    mockToDto.mockResolvedValue(dto)

    await controller.list()

    expect(mockListUseCaseHandle).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledWith(pedido)
  })

  it('create method test', async () => {
    const createDto = new CreatePedidoRequest()

    const consumidor_dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    const dto: PedidoDto = {
      id: 1,
      consumidorId: '1',
      consumidor: consumidor_dto,
      total: 1,
      itens: [],
      status: PedidoStatusEnum.PREPARACAO,
      pagamentoId: '',
      createdAt: new Date(1),
      updatedAt: new Date(1)
    }

    const pedido:Pedido = Pedido.create(
      consumidor,
      [],
      PedidoStatusEnum.PREPARACAO
    )

    mockCreateUseCaseHandle.mockResolvedValue(pedido)
    mockToDto.mockResolvedValue(dto)

    const result = await controller.create(createDto)

    expect(mockCreateUseCaseHandle).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)

    expect(mockCreateUseCaseHandle).toHaveBeenCalledWith(createDto)
    expect(mockToDto).toHaveBeenCalledWith(pedido)

    expect(result).toEqual(dto)
  })

  it('update method test', async () => {
    const updateDto = new UpdatePedidoRequest()

    const consumidor_dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    const dto: PedidoDto = {
      id: 1,
      consumidorId: '1',
      consumidor: consumidor_dto,
      total: 1,
      itens: [],
      status: PedidoStatusEnum.PREPARACAO,
      pagamentoId: '',
      createdAt: new Date(1),
      updatedAt: new Date(1)
    }

    const pedido:Pedido = Pedido.create(
      consumidor,
      [],
      PedidoStatusEnum.PREPARACAO
    )

    mockUpdateUseCaseHandle.mockResolvedValue(pedido)
    mockToDto.mockResolvedValue(dto)

    const result = await controller.update(1, updateDto)

    expect(mockUpdateUseCaseHandle).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)

    expect(mockUpdateUseCaseHandle).toHaveBeenCalledWith(1, updateDto)
    expect(mockToDto).toHaveBeenCalledWith(pedido)

    expect(result).toEqual(dto)
  })

  it('confirmPayment method test', async () => {
    const consumidor_dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    const dto: PedidoDto = {
      id: 1,
      consumidorId: '1',
      consumidor: consumidor_dto,
      total: 1,
      itens: [],
      status: PedidoStatusEnum.PREPARACAO,
      pagamentoId: '',
      createdAt: new Date(1),
      updatedAt: new Date(1)
    }

    const pedido:Pedido = Pedido.create(
      consumidor,
      [],
      PedidoStatusEnum.PREPARACAO
    )

    mockConfirmPaymentUseCaseHandle.mockResolvedValue(pedido)
    mockToDto.mockResolvedValue(dto)

    const result = await controller.confirmPayment(1)

    expect(mockConfirmPaymentUseCaseHandle).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)

    expect(mockConfirmPaymentUseCaseHandle).toHaveBeenCalledWith(1)
    expect(mockToDto).toHaveBeenCalledWith(pedido)

    expect(result).toEqual(dto)
  })

  it('StartAssembly method test', async () => {
    const consumidor_dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    const dto: PedidoDto = {
      id: 1,
      consumidorId: '1',
      consumidor: consumidor_dto,
      total: 1,
      itens: [],
      status: PedidoStatusEnum.PREPARACAO,
      pagamentoId: '',
      createdAt: new Date(1),
      updatedAt: new Date(1)
    }

    const pedido:Pedido = Pedido.create(
      consumidor,
      [],
      PedidoStatusEnum.PREPARACAO
    )

    mockStartAssemblyUseCaseHandle.mockResolvedValue(pedido)
    mockToDto.mockResolvedValue(dto)

    const result = await controller.StartAssembly(1)

    expect(mockStartAssemblyUseCaseHandle).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)

    expect(mockStartAssemblyUseCaseHandle).toHaveBeenCalledWith(1)
    expect(mockToDto).toHaveBeenCalledWith(pedido)

    expect(result).toEqual(dto)
  })

  it('FinishAssembly method test', async () => {
    const consumidor_dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    const dto: PedidoDto = {
      id: 1,
      consumidorId: '1',
      consumidor: consumidor_dto,
      total: 1,
      itens: [],
      status: PedidoStatusEnum.PREPARACAO,
      pagamentoId: '',
      createdAt: new Date(1),
      updatedAt: new Date(1)
    }

    const pedido:Pedido = Pedido.create(
      consumidor,
      [],
      PedidoStatusEnum.PREPARACAO
    )

    mockFinishAssemblyUseCaseHandle.mockResolvedValue(pedido)
    mockToDto.mockResolvedValue(dto)

    const result = await controller.FinishAssembly(1)

    expect(mockFinishAssemblyUseCaseHandle).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)

    expect(mockFinishAssemblyUseCaseHandle).toHaveBeenCalledWith(1)
    expect(mockToDto).toHaveBeenCalledWith(pedido)

    expect(result).toEqual(dto)
  })

  it('findById method test', async () => {
    const consumidor_dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    const dto: PedidoDto = {
      id: 1,
      consumidorId: '1',
      consumidor: consumidor_dto,
      total: 1,
      itens: [],
      status: PedidoStatusEnum.PREPARACAO,
      pagamentoId: '',
      createdAt: new Date(1),
      updatedAt: new Date(1)
    }

    const pedido:Pedido = Pedido.create(
      consumidor,
      [],
      PedidoStatusEnum.PREPARACAO
    )

    mockFindByIdUseCaseHandle.mockResolvedValue(pedido)
    mockToDto.mockResolvedValue(dto)

    const result = await controller.findById(1)

    expect(mockFindByIdUseCaseHandle).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)

    expect(mockFindByIdUseCaseHandle).toHaveBeenCalledWith(1)
    expect(mockToDto).toHaveBeenCalledWith(pedido)

    expect(result).toEqual(dto)
  })
})
