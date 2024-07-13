import Repository from '@/core/domain/repositories/iconsumidor.repository'
import { ConsumidorController } from '@/core/operation/controllers/consumidor.controller'
import ConsumidoresController from '@/infra/web/nestjs/consumidores/consumidores.controller'
import ConsumidorResponse from '@/infra/web/nestjs/consumidores/dto/consumidor.response'
import CreateConsumidorRequest from '@/infra/web/nestjs/consumidores/dto/create-consumidor.request'
import UpdateConsumidorRequest from '@/infra/web/nestjs/consumidores/dto/update-consumidor.request'

describe('Consumidor Controller Class Tests', () => {
  let controller:ConsumidoresController
  let repository:jest.Mocked<Repository>
  let mockControllerCreate:jest.Mock<any>
  let mockControllerUpdate:jest.Mock<any>
  let mockControllerList:jest.Mock<any>
  let mockControllerFindById:jest.Mock<any>
  let mockControllerFindByCpf:jest.Mock<any>

  beforeEach(() => {
    mockControllerCreate = jest.fn()
    mockControllerUpdate = jest.fn()
    mockControllerList = jest.fn()
    mockControllerFindById = jest.fn()
    mockControllerFindByCpf = jest.fn()

    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCPF: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    }

    ConsumidorController.prototype.create = mockControllerCreate
    ConsumidorController.prototype.update = mockControllerUpdate
    ConsumidorController.prototype.list = mockControllerList
    ConsumidorController.prototype.findById = mockControllerFindById
    ConsumidorController.prototype.findByCpf = mockControllerFindByCpf

    controller = new ConsumidoresController(repository)
  })

  it('constructor class test', async () => {
    expect(controller).toBeInstanceOf(ConsumidoresController)
  })

  it('list method class test', async () => {
    const response = new ConsumidorResponse()
    mockControllerList.mockResolvedValue([response])
    const result = await controller.list()
    expect(mockControllerList).toHaveBeenCalledTimes(1)
    expect(result).toEqual([response])
  })

  it('create method class test', async () => {
    const request = new CreateConsumidorRequest()
    const response = new ConsumidorResponse()
    mockControllerCreate.mockResolvedValue(response)
    const result = await controller.create(request)
    expect(mockControllerCreate).toHaveBeenCalledTimes(1)
    expect(mockControllerCreate).toHaveBeenCalledWith(request)
    expect(result).toEqual(response)
  })

  it('update method class test', async () => {
    const id = '1'
    const request = new UpdateConsumidorRequest()
    const response = new ConsumidorResponse()
    mockControllerUpdate.mockResolvedValue(response)
    const result = await controller.update(id, request)
    expect(mockControllerUpdate).toHaveBeenCalledTimes(1)
    expect(mockControllerUpdate).toHaveBeenCalledWith({ ...request, id })
    expect(result).toEqual(response)
  })

  it('search method class test', async () => {
    const cpf = '27117957999'
    const response = new ConsumidorResponse()
    mockControllerFindByCpf.mockResolvedValue(response)
    const result = await controller.search(cpf)
    expect(mockControllerFindByCpf).toHaveBeenCalledTimes(1)
    expect(mockControllerFindByCpf).toHaveBeenCalledWith(cpf)
    expect(result).toEqual(response)
  })

  it('findById method class test', async () => {
    const id = '1'
    const response = new ConsumidorResponse()
    mockControllerFindById.mockResolvedValue(response)
    const result = await controller.findById(id)
    expect(mockControllerFindById).toHaveBeenCalledTimes(1)
    expect(mockControllerFindById).toHaveBeenCalledWith(id)
    expect(result).toEqual(response)
  })
})
