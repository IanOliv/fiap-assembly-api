import ConsumidorUseCase from '@/core/application/usecase/consumidor/consumidor.use-case'
import ConsumidorCreateDto from '@/core/domain/dto/input/consumidor-create.dto'
import ConsumidorUpdateDto from '@/core/domain/dto/input/consumidor-update.dto'
import ConsumidorDto from '@/core/domain/dto/output/consumidor.dto'
import Consumidor from '@/core/domain/entities/consumidor'
import ConsumidorMapper from '@/core/domain/mappers/consumidor.mapper'
import IConsumidorRepository from '@/core/domain/repositories/iconsumidor.repository'
import Cpf from '@/core/domain/value-object/Cpf'
import { ConsumidorController } from '@/core/operation/controllers/consumidor.controller'
import { ConsumidorGateway } from '@/core/operation/gateway/consumidor.gateway'

describe('Test for ConsumidorController Class', () => {
  let controller:ConsumidorController

  let mockRepository:jest.Mocked<IConsumidorRepository>

  let mockGatewayCreate:jest.Mock<any>
  let mockGatewayfindById:jest.Mock<any>
  let mockGatewayfindByCPF:jest.Mock<any>
  let mockGatewaysave:jest.Mock<any>
  let mockGatewayfind:jest.Mock<any>

  let mockUseCaseCreate:jest.Mock<any>
  let mockUseCasefindById:jest.Mock<any>
  let mockUseCasefindByCPF:jest.Mock<any>
  let mockUseCaseList:jest.Mock<any>
  let mockUseCaseUpdate:jest.Mock<any>

  let mockToDto:jest.Mock<any>
  let mockToDomainEntity:jest.Mock<any>

  beforeEach(() => {
    jest.mock('@/core/operation/gateway/consumidor.gateway')
    jest.mock('@/core/application/usecase/consumidor/consumidor.use-case')

    mockGatewayCreate = jest.fn()
    mockGatewayfindById = jest.fn()
    mockGatewayfindByCPF = jest.fn()
    mockGatewaysave = jest.fn()
    mockGatewayfind = jest.fn()

    mockUseCaseCreate = jest.fn()
    mockUseCasefindById = jest.fn()
    mockUseCasefindByCPF = jest.fn()
    mockUseCaseList = jest.fn()
    mockUseCaseUpdate = jest.fn()

    mockToDto = jest.fn()
    mockToDomainEntity = jest.fn()

    ConsumidorGateway.prototype.create = mockGatewayCreate
    ConsumidorGateway.prototype.findById = mockGatewayfindById
    ConsumidorGateway.prototype.findByCPF = mockGatewayfindByCPF
    ConsumidorGateway.prototype.save = mockGatewaysave
    ConsumidorGateway.prototype.find = mockGatewayfind

    ConsumidorUseCase.prototype.create = mockUseCaseCreate
    ConsumidorUseCase.prototype.findById = mockUseCasefindById
    ConsumidorUseCase.prototype.findByCpf = mockUseCasefindByCPF
    ConsumidorUseCase.prototype.list = mockUseCaseList
    ConsumidorUseCase.prototype.update = mockUseCaseUpdate

    ConsumidorMapper.toDto = mockToDto
    ConsumidorMapper.toDomainEntity = mockToDomainEntity

    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCPF: jest.fn(),
      save: jest.fn(),
      find: jest.fn()
    }

    controller = new ConsumidorController(mockRepository)
  })

  it('constructor class test', async () => {
    expect(controller).toBeInstanceOf(ConsumidorController)
  })

  it('create method test', async () => {
    const createDto: ConsumidorCreateDto = {
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    mockUseCaseCreate.mockResolvedValue(consumidor)
    mockToDto.mockResolvedValue(dto)

    const result = await controller.create(createDto)

    expect(mockUseCaseCreate).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)

    expect(mockUseCaseCreate).toHaveBeenCalledWith(createDto)
    expect(mockToDto).toHaveBeenCalledWith(consumidor)

    expect(result).toEqual(dto)
  })

  it('update method test', async () => {
    const updateDto: ConsumidorUpdateDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const dto: ConsumidorDto = {
      id: '1',
      nome: 'UpdatedTest',
      cpf: '27117957999',
      email: 'updated_test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    mockUseCaseUpdate.mockResolvedValue(consumidor)
    mockToDto.mockResolvedValue(dto)

    const result = await controller.update(updateDto)

    expect(mockUseCaseUpdate).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)

    expect(mockUseCaseUpdate).toHaveBeenCalledWith(updateDto)
    expect(mockToDto).toHaveBeenCalledWith(consumidor)

    expect(result).toEqual(dto)
  })

  it('list method test', async () => {
    const dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    mockUseCaseList.mockResolvedValue([consumidor])
    mockToDto.mockResolvedValue(dto)

    await controller.list()

    expect(mockUseCaseList).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledWith(consumidor)
  })

  it('findById method test', async () => {
    const dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    mockUseCasefindById.mockResolvedValue(consumidor)
    mockToDto.mockResolvedValue(dto)

    const result = await controller.findById('1')

    expect(mockUseCasefindById).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)

    expect(mockUseCasefindById).toHaveBeenCalledWith('1')
    expect(mockToDto).toHaveBeenCalledWith(consumidor)

    expect(result).toEqual(dto)
  })

  it('findByCpf method test', async () => {
    const cpf = new Cpf('27117957999', false)

    const dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    mockUseCasefindByCPF.mockResolvedValue(consumidor)
    mockToDto.mockResolvedValue(dto)

    const result = await controller.findByCpf('27117957999')

    expect(mockUseCasefindByCPF).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledTimes(1)

    expect(mockUseCasefindByCPF).toHaveBeenCalledWith(cpf)
    expect(mockToDto).toHaveBeenCalledWith(consumidor)

    expect(result).toEqual(dto)
  })
})
