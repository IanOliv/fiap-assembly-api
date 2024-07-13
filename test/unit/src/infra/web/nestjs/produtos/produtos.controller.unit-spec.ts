import { ProdutoCategoriaEnum } from '@/core/domain/enums/produto-categoria.enum'
import Repository from '@/core/domain/repositories/iproduto.repository'
import AppCache from '@/core/helpers/AppCache'
import { ProdutoController } from '@/core/operation/controllers/produto.controller'
import CreateProdutoRequest from '@/infra/web/nestjs/produtos/dto/create-produto.request'
import ProdutoResponse from '@/infra/web/nestjs/produtos/dto/produto.response'
import UpdateProdutoRequest from '@/infra/web/nestjs/produtos/dto/update-produto.request'
import ProdutosController from '@/infra/web/nestjs/produtos/produtos.controller'

describe('Consumidor Controller Class Tests', () => {
  let controller:ProdutosController
  let cache:jest.Mocked<AppCache>
  let repository:jest.Mocked<Repository>

  let mockControllerCreate:jest.Mock<any>
  let mockControllerUpdate:jest.Mock<any>
  let mockControllerList:jest.Mock<any>
  let mockControllerFindById:jest.Mock<any>
  let mockControllerFindByCategoria:jest.Mock<any>
  let mockControllerRemove:jest.Mock<any>

  beforeEach(() => {
    mockControllerCreate = jest.fn()
    mockControllerUpdate = jest.fn()
    mockControllerList = jest.fn()
    mockControllerFindById = jest.fn()
    mockControllerFindByCategoria = jest.fn()
    mockControllerRemove = jest.fn()

    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCategoria: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    }

    cache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      reset: jest.fn()
    } as unknown as jest.Mocked<AppCache>

    ProdutoController.prototype.create = mockControllerCreate
    ProdutoController.prototype.update = mockControllerUpdate
    ProdutoController.prototype.list = mockControllerList
    ProdutoController.prototype.findById = mockControllerFindById
    ProdutoController.prototype.findByCategoria = mockControllerFindByCategoria
    ProdutoController.prototype.remove = mockControllerRemove

    controller = new ProdutosController(
      repository,
      cache
    )
  })

  it('constructor class test', async () => {
    expect(controller).toBeInstanceOf(ProdutosController)
  })

  it('list method class test cached', async () => {
    const response = new ProdutoResponse()
    cache.get.mockResolvedValue([response])
    const result = await controller.list()
    expect(cache.get).toHaveBeenCalledTimes(1)
    expect(result).toEqual([response])
  })

  it('list method class test not cached', async () => {
    const response = new ProdutoResponse()
    cache.get.mockResolvedValue(null)
    mockControllerList.mockResolvedValue([response])
    const result = await controller.list()
    expect(cache.get).toHaveBeenCalledTimes(1)
    expect(mockControllerList).toHaveBeenCalledTimes(1)
    expect(cache.set).toHaveBeenCalledTimes(1)
    expect(result).toEqual([response])
  })

  it('create method class test', async () => {
    const request = new CreateProdutoRequest()
    const response = new ProdutoResponse()
    mockControllerCreate.mockResolvedValue(response)
    const result = await controller.create(request)
    expect(cache.del).toHaveBeenCalledTimes(2)
    expect(mockControllerCreate).toHaveBeenCalledTimes(1)
    expect(mockControllerCreate).toHaveBeenCalledWith(request)
    expect(result).toEqual(response)
  })

  it('update method class test', async () => {
    const id = '1'
    const request = new UpdateProdutoRequest()
    const response = new ProdutoResponse()
    mockControllerUpdate.mockResolvedValue(response)
    const result = await controller.update(id, request)
    expect(mockControllerUpdate).toHaveBeenCalledTimes(1)
    expect(cache.del).toHaveBeenCalledTimes(5)
    expect(mockControllerUpdate).toHaveBeenCalledWith({ ...request, id })
    expect(result).toEqual(response)
  })

  it('remove method class test', async () => {
    const id = '1'
    const response = new ProdutoResponse()
    mockControllerRemove.mockResolvedValue(response)
    const result = await controller.remove(id)
    expect(mockControllerRemove).toHaveBeenCalledTimes(1)
    expect(cache.del).toHaveBeenCalledTimes(5)
    expect(mockControllerRemove).toHaveBeenCalledWith(id)
    expect(result).toEqual(response)
  })

  it('search method class test cached', async () => {
    const categoria = ProdutoCategoriaEnum.ACOMPANHAMENTO
    const response = new ProdutoResponse()
    cache.get.mockResolvedValue(response)
    const result = await controller.search(categoria)
    expect(cache.get).toHaveBeenCalledTimes(1)
    expect(result).toEqual(response)
  })

  it('search method class test not cached', async () => {
    const categoria = ProdutoCategoriaEnum.ACOMPANHAMENTO
    const response = new ProdutoResponse()
    cache.get.mockResolvedValue(null)
    mockControllerFindByCategoria.mockResolvedValue(response)
    const result = await controller.search(categoria)
    expect(cache.get).toHaveBeenCalledTimes(1)
    expect(cache.set).toHaveBeenCalledTimes(1)
    expect(mockControllerFindByCategoria).toHaveBeenCalledTimes(1)
    expect(mockControllerFindByCategoria).toHaveBeenCalledWith(categoria)
    expect(result).toEqual(response)
  })

  it('findById method class test', async () => {
    const id = '1'
    const response = new ProdutoResponse()
    mockControllerFindById.mockResolvedValue(response)
    const result = await controller.findById(id)
    expect(mockControllerFindById).toHaveBeenCalledTimes(1)
    expect(mockControllerFindById).toHaveBeenCalledWith(id)
    expect(result).toEqual(response)
  })
})
