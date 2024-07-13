import ProdutoUseCase from '@/core/application/usecase/produto/produto.use-case'
import ProdutoCreateDto from '@/core/domain/dto/input/produto-create.dto'
import ProdutoUpdateDto from '@/core/domain/dto/input/produto-update.dto'
import ProdutoDto from '@/core/domain/dto/output/produto.dto'
import Produto from '@/core/domain/entities/produto'
import { ProdutoCategoriaEnum } from '@/core/domain/enums/produto-categoria.enum'
import ProdutoMapper from '@/core/domain/mappers/produto.mapper'
import IProdutoRepository from '@/core/domain/repositories/iproduto.repository'
import { ProdutoController } from '@/core/operation/controllers/produto.controller'
import { ProdutoGateway } from '@/core/operation/gateway/produto.gateway'

describe('Test for ProdutoController Class', () => {
  let controller:ProdutoController

  let mockRepository:jest.Mocked<IProdutoRepository>

  let mockGatewayCreate:jest.Mock<any>
  let mockGatewayfindById:jest.Mock<any>
  let mockGatewayfindByCategoria:jest.Mock<any>
  let mockGatewaysave:jest.Mock<any>
  let mockGatewayfind:jest.Mock<any>

  let mockUseCaseCreate:jest.Mock<any>
  let mockUseCasefindById:jest.Mock<any>
  let mockUseCasefindByCategoria:jest.Mock<any>
  let mockUseCaseList:jest.Mock<any>
  let mockUseCaseUpdate:jest.Mock<any>
  let mockUseCaseRemove:jest.Mock<any>

  let mockToDto:jest.Mock<any>
  let mockToDomainEntity:jest.Mock<any>

  beforeEach(() => {
    jest.mock('@/core/operation/gateway/produto.gateway')
    jest.mock('@/core/application/usecase/produto/produto.use-case')

    mockGatewayCreate = jest.fn()
    mockGatewayfindById = jest.fn()
    mockGatewayfindByCategoria = jest.fn()
    mockGatewaysave = jest.fn()
    mockGatewayfind = jest.fn()

    mockUseCaseCreate = jest.fn()
    mockUseCasefindById = jest.fn()
    mockUseCasefindByCategoria = jest.fn()
    mockUseCaseList = jest.fn()
    mockUseCaseUpdate = jest.fn()
    mockUseCaseRemove = jest.fn()

    mockToDto = jest.fn()
    mockToDomainEntity = jest.fn()

    ProdutoGateway.prototype.create = mockGatewayCreate
    ProdutoGateway.prototype.findById = mockGatewayfindById
    ProdutoGateway.prototype.findByCategoria = mockGatewayfindByCategoria
    ProdutoGateway.prototype.save = mockGatewaysave
    ProdutoGateway.prototype.find = mockGatewayfind

    ProdutoUseCase.prototype.create = mockUseCaseCreate
    ProdutoUseCase.prototype.findById = mockUseCasefindById
    ProdutoUseCase.prototype.findByCategoria = mockUseCasefindByCategoria
    ProdutoUseCase.prototype.list = mockUseCaseList
    ProdutoUseCase.prototype.update = mockUseCaseUpdate
    ProdutoUseCase.prototype.remove = mockUseCaseRemove

    ProdutoMapper.toDto = mockToDto
    ProdutoMapper.toDomainEntity = mockToDomainEntity

    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCategoria: jest.fn(),
      save: jest.fn(),
      find: jest.fn()
    }

    controller = new ProdutoController(mockRepository)
  })

  it('constructor class test', async () => {
    expect(controller).toBeInstanceOf(ProdutoController)
  })

  it('create method test', async () => {
    const createDto: ProdutoCreateDto = {
      nome: 'Name',
      imagemUrl: 'imagemUrl',
      descricao: 'Description',
      preco: 1,
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: []
    }

    const dto: ProdutoDto = {
      id: '1',
      nome: 'Name',
      descricao: 'Description',
      preco: 1,
      imagemUrl: 'imagemUrl',
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: [],
      deletedAt: new Date(1)
    }

    const produto:Produto = Produto.create(
      'Name',
      'Description',
      'imagemUrl',
      1,
      ProdutoCategoriaEnum.ACOMPANHAMENTO
    )

    mockUseCaseCreate.mockResolvedValue(produto)
    mockToDto.mockResolvedValue(dto)

    const result = await controller.create(createDto)

    expect(mockUseCaseCreate).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)

    expect(mockUseCaseCreate).toHaveBeenCalledWith(createDto)
    expect(mockToDto).toHaveBeenCalledWith(produto)

    expect(result).toEqual(dto)
  })

  it('update method test', async () => {
    const updateDto: ProdutoUpdateDto = {
      id: '1',
      nome: 'Name',
      imagemUrl: 'imagemUrl',
      descricao: 'Description',
      preco: 1,
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: []
    }

    const dto: ProdutoDto = {
      id: '1',
      nome: 'Name',
      descricao: 'Description',
      preco: 1,
      imagemUrl: 'imagemUrl',
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: [],
      deletedAt: new Date(1)
    }

    const produto:Produto = Produto.create(
      'Name',
      'Description',
      'imagemUrl',
      1,
      ProdutoCategoriaEnum.ACOMPANHAMENTO
    )

    mockUseCaseUpdate.mockResolvedValue(produto)
    mockToDto.mockResolvedValue(dto)

    const result = await controller.update(updateDto)

    expect(mockUseCaseUpdate).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)

    expect(mockUseCaseUpdate).toHaveBeenCalledWith(updateDto)
    expect(mockToDto).toHaveBeenCalledWith(produto)

    expect(result).toEqual(dto)
  })

  it('list method test', async () => {
    const dto: ProdutoDto = {
      id: '1',
      nome: 'Name',
      descricao: 'Description',
      preco: 1,
      imagemUrl: 'imagemUrl',
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: [],
      deletedAt: new Date(1)
    }

    const produto:Produto = Produto.create(
      'Name',
      'Description',
      'imagemUrl',
      1,
      ProdutoCategoriaEnum.ACOMPANHAMENTO
    )

    mockUseCaseList.mockResolvedValue([produto])
    mockToDto.mockResolvedValue(dto)

    await controller.list()

    expect(mockUseCaseList).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledWith(produto)
  })

  it('findById method test', async () => {
    const dto: ProdutoDto = {
      id: '1',
      nome: 'Name',
      descricao: 'Description',
      preco: 1,
      imagemUrl: 'imagemUrl',
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: [],
      deletedAt: new Date(1)
    }

    const produto:Produto = Produto.create(
      'Name',
      'Description',
      'imagemUrl',
      1,
      ProdutoCategoriaEnum.ACOMPANHAMENTO
    )

    mockUseCasefindById.mockResolvedValue(produto)
    mockToDto.mockResolvedValue(dto)

    const result = await controller.findById('1')

    expect(mockUseCasefindById).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)

    expect(mockUseCasefindById).toHaveBeenCalledWith('1')
    expect(mockToDto).toHaveBeenCalledWith(produto)

    expect(result).toEqual(dto)
  })

  it('findByCategoria method test', async () => {
    const dto: ProdutoDto = {
      id: '1',
      nome: 'Name',
      descricao: 'Description',
      preco: 1,
      imagemUrl: 'imagemUrl',
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: [],
      deletedAt: new Date(1)
    }

    const produto:Produto = Produto.create(
      'Name',
      'Description',
      'imagemUrl',
      1,
      ProdutoCategoriaEnum.ACOMPANHAMENTO
    )

    mockUseCasefindByCategoria.mockResolvedValue([produto])
    mockToDto.mockResolvedValue(dto)

    await controller.findByCategoria(ProdutoCategoriaEnum.ACOMPANHAMENTO)

    expect(mockUseCasefindByCategoria).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)

    expect(mockUseCasefindByCategoria).toHaveBeenCalledWith(ProdutoCategoriaEnum.ACOMPANHAMENTO)
    expect(mockToDto).toHaveBeenCalledWith(produto)
  })

  it('remove method test', async () => {
    const dto: ProdutoDto = {
      id: '1',
      nome: 'Name',
      descricao: 'Description',
      preco: 1,
      imagemUrl: 'imagemUrl',
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: [],
      deletedAt: new Date(1)
    }

    const produto:Produto = Produto.create(
      'Name',
      'Description',
      'imagemUrl',
      1,
      ProdutoCategoriaEnum.ACOMPANHAMENTO
    )

    mockUseCaseRemove.mockResolvedValue(produto)
    mockToDto.mockResolvedValue(dto)

    const result = await controller.remove('1')

    expect(mockUseCaseRemove).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)

    expect(mockUseCaseRemove).toHaveBeenCalledWith('1')
    expect(mockToDto).toHaveBeenCalledWith(produto)

    expect(result).toEqual(dto)
  })
})
