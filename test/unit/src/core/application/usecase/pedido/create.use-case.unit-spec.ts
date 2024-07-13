import Create from '@/core/application/usecase/pedido/create.use-case'
import Consumidor from '@/core/domain/entities/consumidor'
import Pedido from '@/core/domain/entities/pedido'
import Produto from '@/core/domain/entities/produto'
import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'
import { ProdutoCategoriaEnum } from '@/core/domain/enums/produto-categoria.enum'
import BusinessException from '@/core/domain/errors/business-exception'
import IConsumidorRepository from '@/core/domain/repositories/iconsumidor.repository'
import IPedidoRepository from '@/core/domain/repositories/ipedido.repository'
import IProdutoRepository from '@/core/domain/repositories/iproduto.repository'
import IPaymentService from '@/core/domain/services/ipayment.service'
import { ConsumidorGateway } from '@/core/operation/gateway/consumidor.gateway'
import { PaymentGateway } from '@/core/operation/gateway/payment.gateway'
import { PedidoGateway } from '@/core/operation/gateway/pedido.gateway'
import { ProdutoGateway } from '@/core/operation/gateway/produto.gateway'
import CreatePedidoRequest from '@/infra/web/nestjs/pedidos/dto/create-pedido.request'

describe('Create Class Tests', () => {
  let mockPedidoGateway:PedidoGateway
  let mockProdutoGateway:ProdutoGateway
  let mockConsumidorGateway:ConsumidorGateway
  let mockPaymentGateway:PaymentGateway

  let useCase:Create

  let mockPedidoRepository:jest.Mocked<IPedidoRepository>
  let mockConsumidorRepository:jest.Mocked<IConsumidorRepository>
  let mockProdutoRepository:jest.Mocked<IProdutoRepository>
  let mockPaymentService:jest.Mocked<IPaymentService>

  let mockConsumidorcreate:jest.Mock<any>
  let mockConsumidorFindById:jest.Mock<any>
  let mockConsumidorFindByCPF:jest.Mock<any>
  let mockConsumidorSave:jest.Mock<any>
  let mockConsumidorFind:jest.Mock<any>

  let mockPaymentRegisterOrder:jest.Mock<any>

  let mockPedidoCreate:jest.Mock<any>
  let mockPedidoFindById:jest.Mock<any>
  let mockPedidoList:jest.Mock<any>
  let mockPedidoSave:jest.Mock<any>

  let mockProdutocreate:jest.Mock<any>
  let mockProdutoFindById:jest.Mock<any>
  let mockProdutoFindByCategoria:jest.Mock<any>
  let mockProdutoSave:jest.Mock<any>
  let mockProdutoFind:jest.Mock<any>

  beforeEach(() => {
    jest.mock('@/core/operation/gateway/consumidor.gateway')
    jest.mock('@/core/operation/gateway/payment.gateway')
    jest.mock('@/core/operation/gateway/pedido.gateway')
    jest.mock('@/core/operation/gateway/produto.gateway')

    mockConsumidorcreate = jest.fn()
    mockConsumidorFindById = jest.fn()
    mockConsumidorFindByCPF = jest.fn()
    mockConsumidorSave = jest.fn()
    mockConsumidorFind = jest.fn()

    mockPaymentRegisterOrder = jest.fn()

    mockPedidoCreate = jest.fn()
    mockPedidoFindById = jest.fn()
    mockPedidoList = jest.fn()
    mockPedidoSave = jest.fn()

    mockProdutocreate = jest.fn()
    mockProdutoFindById = jest.fn()
    mockProdutoFindByCategoria = jest.fn()
    mockProdutoSave = jest.fn()
    mockProdutoFind = jest.fn()

    ConsumidorGateway.prototype.create = mockConsumidorcreate
    ConsumidorGateway.prototype.find = mockConsumidorFind
    ConsumidorGateway.prototype.findById = mockConsumidorFindById
    ConsumidorGateway.prototype.findByCPF = mockConsumidorFindByCPF
    ConsumidorGateway.prototype.save = mockConsumidorSave

    PaymentGateway.prototype.registerOrder = mockPaymentRegisterOrder

    PedidoGateway.prototype.create = mockPedidoCreate
    PedidoGateway.prototype.findById = mockPedidoFindById
    PedidoGateway.prototype.list = mockPedidoList
    PedidoGateway.prototype.save = mockPedidoSave

    ProdutoGateway.prototype.create = mockProdutocreate
    ProdutoGateway.prototype.find = mockProdutoFind
    ProdutoGateway.prototype.findById = mockProdutoFindById
    ProdutoGateway.prototype.findByCategoria = mockProdutoFindByCategoria
    ProdutoGateway.prototype.save = mockProdutoSave

    mockConsumidorRepository = {
      find: jest.fn(),
      findById: jest.fn(),
      findByCPF: jest.fn(),
      create: jest.fn(),
      save: jest.fn()
    }

    mockPaymentService = {
      registerOrder: jest.fn()
    }

    mockPedidoRepository = {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      save: jest.fn()
    }

    mockProdutoRepository = {
      find: jest.fn(),
      findById: jest.fn(),
      findByCategoria: jest.fn(),
      create: jest.fn(),
      save: jest.fn()
    }

    mockConsumidorGateway = new ConsumidorGateway(mockConsumidorRepository)
    mockPaymentGateway = new PaymentGateway(mockPaymentService)
    mockPedidoGateway = new PedidoGateway(mockPedidoRepository)
    mockProdutoGateway = new ProdutoGateway(mockProdutoRepository)

    useCase = new Create(
      mockPedidoGateway,
      mockConsumidorGateway,
      mockProdutoGateway,
      mockPaymentGateway
    )
  })

  it('constructor class test', async () => {
    expect(useCase).toBeInstanceOf(Create)
  })

  it('test handle method using a input with an id', async () => {
    const itemRemovido = {
      produtoId: '1',
      ingredientesRemovidos: ['item']
    }

    const input:CreatePedidoRequest = {
      consumidorId: '1',
      itens: [itemRemovido]
    }
    const consumidor = Consumidor.create('nome', '57965568438', 'test@test.com')
    const pedido = Pedido.create(consumidor, [], PedidoStatusEnum.PAGAMENTO_PENDENTE)
    const produto = Produto.create('nome', 'descrição', 'imageUrl', 1, ProdutoCategoriaEnum.BEBIDA)
    mockConsumidorFindById.mockResolvedValue(consumidor)
    mockProdutoFindById.mockResolvedValue(produto)
    mockPedidoCreate.mockResolvedValue(pedido)
    mockPaymentRegisterOrder.mockResolvedValue('1')

    const result = await useCase.handle(input)

    expect(mockConsumidorFindById).toHaveBeenCalledTimes(1)
    expect(mockPedidoCreate).toHaveBeenCalledTimes(1)
    expect(mockPaymentRegisterOrder).toHaveBeenCalledTimes(1)
    expect(mockPedidoSave).toHaveBeenCalledTimes(1)
    expect(result).toEqual(pedido)
  })

  it('test buildItens method with a not registered product', async () => {
    const itemRemovido = {
      produtoId: '1',
      ingredientesRemovidos: ['item']
    }

    const input:CreatePedidoRequest = {
      consumidorId: '1',
      itens: [itemRemovido]
    }
    const consumidor = Consumidor.create('nome', '57965568438', 'test@test.com')
    const pedido = Pedido.create(consumidor, [], PedidoStatusEnum.PAGAMENTO_PENDENTE)
    mockConsumidorFindById.mockResolvedValue(consumidor)
    mockProdutoFindById.mockResolvedValue(null)
    mockPedidoCreate.mockResolvedValue(pedido)
    mockPaymentRegisterOrder.mockResolvedValue('1')

    await expect(useCase.handle(input)).rejects.toThrow(new BusinessException('Produto não encontrado'))
  })
})
