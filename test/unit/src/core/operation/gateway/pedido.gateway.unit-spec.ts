import Pedido from '@/core/domain/entities/pedido'
import IPedidoRepository from '@/core/domain/repositories/ipedido.repository'
import { PedidoGateway } from '@/core/operation/gateway/pedido.gateway'

describe('Test PedidoGateway class', () => {
  let gateway:PedidoGateway
  let mockRepository:jest.Mocked<IPedidoRepository>

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      save: jest.fn()
    }

    gateway = new PedidoGateway(mockRepository)
  })

  it('Testing class constructor', () => {
    expect(gateway).toBeInstanceOf(PedidoGateway)
  })

  it('Test findById method returning Pedido Promise', async () => {
    const pedido = new Pedido()
    mockRepository.findById.mockResolvedValue(pedido)
    const result = await gateway.findById(1)
    expect(mockRepository.findById).toHaveBeenCalledWith(1)
    expect(mockRepository.findById).toHaveBeenCalledTimes(1)
    expect(result).toEqual(pedido)
  })

  it('Test findById method returning undefined Promise', async () => {
    mockRepository.findById.mockResolvedValue(undefined)
    const result = await gateway.findById(1)
    expect(mockRepository.findById).toHaveBeenCalledWith(1)
    expect(mockRepository.findById).toHaveBeenCalledTimes(1)
    expect(result).toEqual(undefined)
  })

  it('Test create method', async () => {
    const pedido = new Pedido()
    mockRepository.create.mockResolvedValue(pedido)
    const result = await gateway.create(pedido)
    expect(mockRepository.create).toHaveBeenCalledWith(pedido)
    expect(mockRepository.create).toHaveBeenCalledTimes(1)
    expect(result).toEqual(pedido)
  })

  it('Test list method', async () => {
    const pedido = new Pedido()
    mockRepository.find.mockResolvedValue([pedido])
    const result = await gateway.list()
    expect(mockRepository.find).toHaveBeenCalledTimes(1)
    expect(result).toEqual([pedido])
  })

  it('Test save method', async () => {
    const pedido = new Pedido()
    mockRepository.save.mockResolvedValue(pedido)
    const result = await gateway.save(pedido)
    expect(mockRepository.save).toHaveBeenCalledWith(pedido)
    expect(mockRepository.save).toHaveBeenCalledTimes(1)
    expect(result).toEqual(pedido)
  })
})
