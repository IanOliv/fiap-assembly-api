import { IsNull, Repository } from 'typeorm'

import ProdutoDto from '@/core/domain/dto/output/produto.dto'
import Produto from '@/core/domain/entities/produto'
import { ProdutoCategoriaEnum } from '@/core/domain/enums/produto-categoria.enum'
import BusinessException from '@/core/domain/errors/business-exception'
import ProdutoMapper from '@/core/domain/mappers/produto.mapper'
import { Produto as Entity } from '@/infra/persistence/typeorm/entities/produto'
import ProdutoTypeormRepository from '@/infra/persistence/typeorm/repository/produto-typeorm.repository'

describe('ProdutoTypeormRepository Class Tests', () => {
  let produtoRepository:ProdutoTypeormRepository

  let repository:jest.Mocked<Repository<Entity>>

  let mockToDto:jest.Mock<any>
  let toDomainEntity:jest.Mock<any>

  beforeEach(() => {
    mockToDto = jest.fn()
    toDomainEntity = jest.fn()

    repository = {
      insert: jest.fn(),
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<Entity>>

    ProdutoMapper.toDto = mockToDto
    ProdutoMapper.toDomainEntity = toDomainEntity

    produtoRepository = new ProdutoTypeormRepository(repository)
  })

  it('constructtor class test', async () => {
    expect(produtoRepository).toBeInstanceOf(ProdutoTypeormRepository)
  })

  it('create class method test', async () => {
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

    mockToDto.mockResolvedValue(dto)

    await produtoRepository.create(produto)

    expect(mockToDto).toHaveBeenCalledTimes(1)
    expect(repository.save).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledWith(produto)
  })

  it('findById class method test using registered id', async () => {
    const query = {
      where: {
        id: '1',
        deletedAt: IsNull()
      },
      relations: {
        ingredientes: true,
      }
    }

    const produto:Produto = Produto.create(
      'Name',
      'Description',
      'imagemUrl',
      1,
      ProdutoCategoriaEnum.ACOMPANHAMENTO
    )

    const entity = new Entity({
      id: '1',
      nome: 'Name',
      descricao: 'Description',
      preco: 1,
      imagemUrl: 'imagemUrl',
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: [],
      deletedAt: new Date(1)
    })

    toDomainEntity.mockResolvedValue(produto)
    repository.findOne.mockResolvedValue(entity)

    const result = await produtoRepository.findById('1')

    expect(toDomainEntity).toHaveBeenCalledTimes(1)
    expect(repository.findOne).toHaveBeenCalledTimes(1)

    expect(repository.findOne).toHaveBeenCalledWith(query)
    expect(toDomainEntity).toHaveBeenCalledWith(entity)

    expect(result).toEqual(produto)
  })

  it('findById class method test using not registered id', async () => {
    const query = {
      where: {
        id: '1',
        deletedAt: IsNull()
      },
      relations: {
        ingredientes: true,
      }
    }

    repository.findOne.mockResolvedValue(null)

    const result = await produtoRepository.findById('1')

    expect(toDomainEntity).toHaveBeenCalledTimes(0)
    expect(repository.findOne).toHaveBeenCalledTimes(1)
    expect(repository.findOne).toHaveBeenCalledWith(query)
    expect(result).toEqual(undefined)
  })

  it('save class method test using registered id', async () => {
    const produto:Produto = Produto.create(
      'Name',
      'Description',
      'imagemUrl',
      1,
      ProdutoCategoriaEnum.ACOMPANHAMENTO
    )

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

    const query = {
      where: {
        id: produto.id,
        deletedAt: IsNull()
      },
      relations: {
        ingredientes: true,
      }
    }

    const entity = new Entity({
      id: '1',
      nome: 'Name',
      descricao: 'Description',
      preco: 1,
      imagemUrl: 'imagemUrl',
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: [],
      deletedAt: new Date(1)
    })

    toDomainEntity.mockResolvedValue(produto)
    mockToDto.mockResolvedValue(dto)
    repository.findOne.mockResolvedValue(entity)

    await produtoRepository.save(produto)

    expect(toDomainEntity).toHaveBeenCalledTimes(1)
    expect(repository.findOne).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)
    expect(repository.save).toHaveBeenCalledTimes(1)

    expect(repository.findOne).toHaveBeenCalledWith(query)
    expect(toDomainEntity).toHaveBeenCalledWith(entity)
    expect(mockToDto).toHaveBeenCalledWith(produto)
  })

  it('save class method test using not registered id', async () => {
    const produto:Produto = Produto.create(
      'Name',
      'Description',
      'imagemUrl',
      1,
      ProdutoCategoriaEnum.ACOMPANHAMENTO
    )

    repository.findOne.mockResolvedValue(null)

    await expect(produtoRepository.save(produto)).rejects.toThrow(new BusinessException('Produto não existe'))
  })

  it('find class method test', async () => {
    const query = {
      where: {
        deletedAt: IsNull()
      },
      relations: {
        ingredientes: true,
      }
    }

    const produto:Produto = Produto.create(
      'Name',
      'Description',
      'imagemUrl',
      1,
      ProdutoCategoriaEnum.ACOMPANHAMENTO
    )

    const entity = new Entity({
      id: '1',
      nome: 'Name',
      descricao: 'Description',
      preco: 1,
      imagemUrl: 'imagemUrl',
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: [],
      deletedAt: new Date(1)
    })

    toDomainEntity.mockResolvedValue(produto)
    repository.find.mockResolvedValue([entity])

    await produtoRepository.find()

    expect(toDomainEntity).toHaveBeenCalledTimes(1)
    expect(repository.find).toHaveBeenCalledTimes(1)

    expect(repository.find).toHaveBeenCalledWith(query)
    expect(toDomainEntity).toHaveBeenCalledWith(entity)
  })

  it('findByCategoria class method test', async () => {
    const produto:Produto = Produto.create(
      'Name',
      'Description',
      'imagemUrl',
      1,
      ProdutoCategoriaEnum.ACOMPANHAMENTO
    )

    const entity = new Entity({
      id: '1',
      nome: 'Name',
      descricao: 'Description',
      preco: 1,
      imagemUrl: 'imagemUrl',
      categoria: produto.categoria,
      ingredientes: [],
      deletedAt: new Date(1)
    })

    toDomainEntity.mockResolvedValue(produto)
    repository.find.mockResolvedValue([entity])

    await produtoRepository.findByCategoria(ProdutoCategoriaEnum.ACOMPANHAMENTO)

    expect(toDomainEntity).toHaveBeenCalledTimes(1)
    expect(repository.find).toHaveBeenCalledTimes(1)
    expect(toDomainEntity).toHaveBeenCalledWith(entity)
  })
})
