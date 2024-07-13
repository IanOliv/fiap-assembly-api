import ConsumidorUseCase from '@/core/application/usecase/consumidor/consumidor.use-case'
import ConsumidorCreateDto from '@/core/domain/dto/input/consumidor-create.dto'
import ConsumidorUpdateDto from '@/core/domain/dto/input/consumidor-update.dto'
import Consumidor from '@/core/domain/entities/consumidor'
import BusinessException from '@/core/domain/errors/business-exception'
import Repository from '@/core/domain/repositories/iconsumidor.repository'
import Cpf from '@/core/domain/value-object/Cpf'
import { ConsumidorGateway } from '@/core/operation/gateway/consumidor.gateway'

describe('ConsumidorUseCase Class Tests', () => {
  let mockGateway:ConsumidorGateway
  let useCase:ConsumidorUseCase
  let mockRepository:jest.Mocked<Repository>
  let mockCreate:jest.Mock<any>
  let mockfindById:jest.Mock<any>
  let mockfindByCPF:jest.Mock<any>
  let mocksave:jest.Mock<any>
  let mockfind:jest.Mock<any>

  beforeEach(() => {
    jest.mock('@/core/operation/gateway/consumidor.gateway')

    mockCreate = jest.fn()
    mockfindById = jest.fn()
    mockfindByCPF = jest.fn()
    mocksave = jest.fn()
    mockfind = jest.fn()

    ConsumidorGateway.prototype.create = mockCreate
    ConsumidorGateway.prototype.findById = mockfindById
    ConsumidorGateway.prototype.findByCPF = mockfindByCPF
    ConsumidorGateway.prototype.save = mocksave
    ConsumidorGateway.prototype.find = mockfind

    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCPF: jest.fn(),
      save: jest.fn(),
      find: jest.fn()
    }

    mockGateway = new ConsumidorGateway(mockRepository)
    useCase = new ConsumidorUseCase(mockGateway)
  })

  it('constructor class test', async () => {
    expect(useCase).toBeInstanceOf(ConsumidorUseCase)
  })

  it('test create method using available cpf', async () => {
    const consumidor = Consumidor.create('Test', '42716936005', 'test@test.com')

    const dto: ConsumidorCreateDto = {
      nome: 'Test',
      cpf: '42716936005',
      email: 'test@test.com'
    }

    mockfindByCPF.mockResolvedValue(undefined)
    mockCreate.mockResolvedValue(consumidor)

    const result = await useCase.create(dto)

    expect(mockfindByCPF).toHaveBeenCalledTimes(1)
    expect(mockCreate).toHaveBeenCalledTimes(1)

    expect(mockfindByCPF).toHaveBeenCalledWith(consumidor.cpf)
    expect(mockCreate).toHaveBeenCalledWith(result)

    expect(result.nome).toEqual(consumidor.nome)
    expect(result.cpf).toEqual(consumidor.cpf)
    expect(result.email).toEqual(consumidor.email)
  })

  it('test create method using not available cpf', async () => {
    const consumidor = Consumidor.create('Test', '42716936005', 'test@test.com')

    const dto: ConsumidorCreateDto = {
      nome: 'Test',
      cpf: '42716936005',
      email: 'test@test.com'
    }

    mockfindByCPF.mockResolvedValue(consumidor)

    await expect(useCase.create(dto)).rejects.toThrow(new BusinessException('Consumidor já cadastrado com esse cpf'))
  })

  it('test update method using not registered customer', async () => {
    const dto: ConsumidorUpdateDto = {
      id: '1',
      nome: 'Test',
      cpf: '42716936005',
      email: 'test@test.com'
    }

    mockfindById.mockResolvedValue(undefined)

    await expect(useCase.update(dto)).rejects.toThrow(new BusinessException('Consumidor não encontrado'))
  })

  it('test update method using a registered customer', async () => {
    const old_consumidor = Consumidor.create('Test', '42716936005', 'test@test.com')
    const updated_consumidor = Consumidor.create('Updated_Test', '42716936005', 'updated_test@test.com')

    const dto: ConsumidorUpdateDto = {
      id: '1',
      nome: 'Updated_Test',
      cpf: '42716936005',
      email: 'updated_test@test.com'
    }

    mockfindById.mockResolvedValue(old_consumidor)
    mocksave.mockResolvedValue(updated_consumidor)

    const result = await useCase.update(dto)

    expect(mockfindById).toHaveBeenCalledTimes(1)
    expect(mocksave).toHaveBeenCalledTimes(1)

    expect(mockfindById).toHaveBeenCalledWith(dto.id)
    expect(mocksave).toHaveBeenCalledWith(result)

    expect(result.nome).toEqual(updated_consumidor.nome)
    expect(result.cpf).toEqual(updated_consumidor.cpf)
    expect(result.email).toEqual(updated_consumidor.email)
  })

  it('test list method', async () => {
    const consumidor = Consumidor.create('Test', '42716936005', 'test@test.com')
    mockfind.mockResolvedValue([consumidor])

    const result = await useCase.list()

    expect(mockfind).toHaveBeenCalledTimes(1)
    expect(result).toEqual([consumidor])
  })

  it('test findById method using a registered customer', async () => {
    const consumidor = Consumidor.create('Test', '42716936005', 'test@test.com')

    mockfindById.mockResolvedValue(consumidor)

    const result = await useCase.findById('1')

    expect(mockfindById).toHaveBeenCalledTimes(1)
    expect(mockfindById).toHaveBeenCalledWith('1')
    expect(result).toEqual(consumidor)
  })

  it('test findById method using a not registered customer', async () => {
    mockfindById.mockResolvedValue(undefined)
    await expect(useCase.findById('1')).rejects.toThrow(new BusinessException('Consumidor não encontrado'))
  })

  it('test findByCpf method using a registered cpf', async () => {
    const cpf = new Cpf('42716936005')
    const consumidor = Consumidor.create('Test', '42716936005', 'test@test.com')

    mockfindByCPF.mockResolvedValue(consumidor)

    const result = await useCase.findByCpf(cpf)

    expect(mockfindByCPF).toHaveBeenCalledTimes(1)
    expect(mockfindByCPF).toHaveBeenCalledWith(cpf)
    expect(result).toEqual(consumidor)
  })

  it('test findByCpf method using a not registered cpf', async () => {
    mockfindByCPF.mockResolvedValue(undefined)

    await expect(useCase.findByCpf(new Cpf('', false))).rejects.toThrow(new BusinessException('Consumidor não encontrado'))
  })
})
