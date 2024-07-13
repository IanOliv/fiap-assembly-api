import ProdutoUseCase from '@/core/application/usecase/produto/produto.use-case'
import ProdutoCreateDto from '@/core/domain/dto/input/produto-create.dto'
import ProdutoUpdateDto from '@/core/domain/dto/input/produto-update.dto'
import Produto from '@/core/domain/entities/produto'
import { ProdutoCategoriaEnum } from '@/core/domain/enums/produto-categoria.enum'
import BusinessException from '@/core/domain/errors/business-exception'
import Repository from '@/core/domain/repositories/iproduto.repository'
import { ProdutoGateway } from '@/core/operation/gateway/produto.gateway'

describe('ProdutoUseCase Class Tests', () => {
  let mockGateway:ProdutoGateway
  let useCase:ProdutoUseCase
  let mockRepository:jest.Mocked<Repository>
  let mockCreate:jest.Mock<any>
  let mockfindById:jest.Mock<any>
  let mockfindByCategoria:jest.Mock<any>
  let mocksave:jest.Mock<any>
  let mockfind:jest.Mock<any>

  beforeEach(() => {
    jest.mock('@/core/operation/gateway/produto.gateway')

    mockCreate = jest.fn()
    mockfindById = jest.fn()
    mockfindByCategoria = jest.fn()
    mocksave = jest.fn()
    mockfind = jest.fn()

    ProdutoGateway.prototype.create = mockCreate
    ProdutoGateway.prototype.findById = mockfindById
    ProdutoGateway.prototype.findByCategoria = mockfindByCategoria
    ProdutoGateway.prototype.save = mocksave
    ProdutoGateway.prototype.find = mockfind

    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCategoria: jest.fn(),
      save: jest.fn(),
      find: jest.fn()
    }

    mockGateway = new ProdutoGateway(mockRepository)
    useCase = new ProdutoUseCase(mockGateway)
  })

  it('constructor class test', async () => {
    expect(useCase).toBeInstanceOf(ProdutoUseCase)
  })

  it('test create method', async () => {
    const produto = Produto.create(
      '',
      '',
      '',
      1,
      ProdutoCategoriaEnum.LANCHE
    )

    const dto:ProdutoCreateDto = {
      nome: '',
      imagemUrl: '',
      descricao: '',
      preco: 1,
      categoria: ProdutoCategoriaEnum.LANCHE,
      ingredientes: [{
        id: '',
        nome: '',
        imagemUrl: '',
        preco: 1
      }]
    }

    mockCreate.mockResolvedValue(produto)
    mocksave.mockResolvedValue(produto)

    const result = await useCase.create(dto)

    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(mocksave).toHaveBeenCalledTimes(1)

    expect(mockCreate).toHaveBeenCalledWith(result)
    expect(mocksave).toHaveBeenCalledWith(result)

    expect(result.nome).toEqual(produto.nome)
    expect(result.descricao).toEqual(produto.descricao)
    expect(result.imagemUrl).toEqual(produto.imagemUrl)
    expect(result.preco).toEqual(produto.preco)
    expect(result.categoria).toEqual(produto.categoria)
  })

  it('test update method using not registered product', async () => {
    const dto: ProdutoUpdateDto = {
      id: '1',
      nome: '',
      imagemUrl: '',
      descricao: '',
      preco: 1,
      categoria: ProdutoCategoriaEnum.LANCHE
    }

    mockfindById.mockResolvedValue(undefined)

    await expect(useCase.update(dto)).rejects.toThrow(new BusinessException('Produto não encontrado'))
  })

  it('test update method using a registered product', async () => {
    const old_produto = Produto.create(
      'Old_Name',
      'Old_description',
      '',
      1,
      ProdutoCategoriaEnum.LANCHE
    )

    const updated_produto = Produto.create(
      'New_Name',
      'New_description',
      '',
      2,
      ProdutoCategoriaEnum.BEBIDA
    )

    const dto: ProdutoUpdateDto = {
      id: '1',
      nome: 'New_Name',
      imagemUrl: '',
      descricao: 'New_description',
      preco: 2,
      categoria: ProdutoCategoriaEnum.BEBIDA
    }

    mockfindById.mockResolvedValue(old_produto)
    mocksave.mockResolvedValue(updated_produto)

    const result = await useCase.update(dto)

    expect(mockfindById).toHaveBeenCalledTimes(1)
    expect(mocksave).toHaveBeenCalledTimes(1)

    expect(mockfindById).toHaveBeenCalledWith(dto.id)
    expect(mocksave).toHaveBeenCalledWith(result)

    expect(result.nome).toEqual(updated_produto.nome)
    expect(result.descricao).toEqual(updated_produto.descricao)
    expect(result.preco).toEqual(updated_produto.preco)
    expect(result.categoria).toEqual(updated_produto.categoria)
  })

  it('test list method', async () => {
    const produto = Produto.create(
      '',
      '',
      '',
      1,
      ProdutoCategoriaEnum.LANCHE
    )

    mockfind.mockResolvedValue([produto])

    const result = await useCase.list()

    expect(mockfind).toHaveBeenCalledTimes(1)
    expect(result).toEqual([produto])
  })

  it('test findByCategoria method', async () => {
    const produto = Produto.create(
      '',
      '',
      '',
      1,
      ProdutoCategoriaEnum.LANCHE
    )

    mockfindByCategoria.mockResolvedValue([produto])

    const result = await useCase.findByCategoria(ProdutoCategoriaEnum.LANCHE)

    expect(mockfindByCategoria).toHaveBeenCalledTimes(1)
    expect(result).toEqual([produto])
  })

  it('test findById method using a registered product', async () => {
    const produto = Produto.create(
      '',
      '',
      '',
      1,
      ProdutoCategoriaEnum.LANCHE
    )

    mockfindById.mockResolvedValue(produto)

    const result = await useCase.findById('1')

    expect(mockfindById).toHaveBeenCalledTimes(1)
    expect(mockfindById).toHaveBeenCalledWith('1')
    expect(result).toEqual(produto)
  })

  it('test findById method using a not registered product', async () => {
    mockfindById.mockResolvedValue(undefined)
    await expect(useCase.findById('1')).rejects.toThrow(new BusinessException('Produto não encontrado'))
  })

  it('test remove method using a registered product', async () => {
    const produto = Produto.create(
      '',
      '',
      '',
      1,
      ProdutoCategoriaEnum.LANCHE
    )

    mockfindById.mockResolvedValue(produto)

    const result = await useCase.remove('1')

    expect(mockfindById).toHaveBeenCalledTimes(1)
    expect(mocksave).toHaveBeenCalledTimes(1)
    expect(mockfindById).toHaveBeenCalledWith('1')
    expect(mocksave).toHaveBeenCalledWith(result)
    expect(result.nome).toEqual(produto.nome)
    expect(result.descricao).toEqual(produto.descricao)
    expect(result.preco).toEqual(produto.preco)
    expect(result.categoria).toEqual(produto.categoria)
  })

  it('test remove method using a not registered product', async () => {
    mockfindById.mockResolvedValue(undefined)
    await expect(useCase.remove('1')).rejects.toThrow(new BusinessException('Produto não encontrado'))
  })
})
