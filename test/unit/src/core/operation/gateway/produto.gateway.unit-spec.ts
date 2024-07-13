import Produto from '@/core/domain/entities/produto'
import { ProdutoCategoriaEnum } from '@/core/domain/enums/produto-categoria.enum'
import Repository from '@/core/domain/repositories/iproduto.repository'
import { ProdutoGateway } from '@/core/operation/gateway/produto.gateway'

describe('Test ProdutoGateway class', () => {
  let gateway:ProdutoGateway
  let mockRepository:jest.Mocked<Repository>

  beforeEach(() => {
    mockRepository = {
      findByCategoria: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      find: jest.fn()
    }

    gateway = new ProdutoGateway(mockRepository)
  })

  it('Testing class constructor', () => {
    expect(gateway).toBeInstanceOf(ProdutoGateway)
  })

  it('Test findById method returning Produto Promise', async () => {
    const produto = new Produto()
    mockRepository.findById.mockResolvedValue(produto)
    const result = await gateway.findById('1')
    expect(mockRepository.findById).toHaveBeenCalledWith('1')
    expect(mockRepository.findById).toHaveBeenCalledTimes(1)
    expect(result).toEqual(produto)
  })

  it('Test findById method returning undefined Promise', async () => {
    mockRepository.findById.mockResolvedValue(undefined)
    const result = await gateway.findById('1')
    expect(mockRepository.findById).toHaveBeenCalledWith('1')
    expect(mockRepository.findById).toHaveBeenCalledTimes(1)
    expect(result).toEqual(undefined)
  })

  it('Test findByCategoria method', async () => {
    const produto = new Produto()
    mockRepository.findByCategoria.mockResolvedValue([produto])
    const result = await gateway.findByCategoria(ProdutoCategoriaEnum.SOBREMESA)
    expect(mockRepository.findByCategoria).toHaveBeenCalledWith(ProdutoCategoriaEnum.SOBREMESA)
    expect(mockRepository.findByCategoria).toHaveBeenCalledTimes(1)
    expect(result).toEqual([produto])
  })

  it('Test create method', async () => {
    const produto = new Produto()
    mockRepository.create.mockResolvedValue()
    await gateway.create(produto)
    expect(mockRepository.create).toHaveBeenCalledWith(produto)
    expect(mockRepository.create).toHaveBeenCalledTimes(1)
  })

  it('Test save method', async () => {
    const produto = new Produto()
    mockRepository.save.mockResolvedValue()
    await gateway.save(produto)
    expect(mockRepository.save).toHaveBeenCalledWith(produto)
    expect(mockRepository.save).toHaveBeenCalledTimes(1)
  })

  it('Test find method', async () => {
    const produto = new Produto()
    mockRepository.find.mockResolvedValue([produto])
    const result = await gateway.find()
    expect(mockRepository.find).toHaveBeenCalledTimes(1)
    expect(result).toEqual([produto])
  })
})
