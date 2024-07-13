import { Repository } from 'typeorm'

import ConsumidorDto from '@/core/domain/dto/output/consumidor.dto'
import Consumidor from '@/core/domain/entities/consumidor'
import BusinessException from '@/core/domain/errors/business-exception'
import ConsumidorMapper from '@/core/domain/mappers/consumidor.mapper'
import Cpf from '@/core/domain/value-object/Cpf'
import { Consumidor as Entity } from '@/infra/persistence/typeorm/entities/consumidor'
import ConsumidorTypeormRepository from '@/infra/persistence/typeorm/repository/consumidor-typeorm.repository'

describe('ConsumidorTypeormRepository Class Tests', () => {
  let consumerRepository:ConsumidorTypeormRepository

  let repository:jest.Mocked<Repository<Entity>>

  let mockToDto:jest.Mock<any>
  let toDomainEntity:jest.Mock<any>

  beforeEach(() => {
    mockToDto = jest.fn()
    toDomainEntity = jest.fn()

    repository = {
      insert: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      find: jest.fn()
    } as unknown as jest.Mocked<Repository<Entity>>

    ConsumidorMapper.toDto = mockToDto
    ConsumidorMapper.toDomainEntity = toDomainEntity

    consumerRepository = new ConsumidorTypeormRepository(repository)
  })

  it('constructtor class test', async () => {
    expect(consumerRepository).toBeInstanceOf(ConsumidorTypeormRepository)
  })

  it('create method class test', async () => {
    const dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    mockToDto.mockResolvedValue(dto)

    const result = await consumerRepository.create(consumidor)

    expect(mockToDto).toHaveBeenCalledTimes(1)
    expect(repository.insert).toHaveBeenCalledTimes(1)
    expect(mockToDto).toHaveBeenCalledWith(consumidor)

    expect(result).toEqual(consumidor)
  })

  it('findById method class test using registered customer', async () => {
    const dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    toDomainEntity.mockResolvedValue(consumidor)
    repository.findOneBy.mockResolvedValue(dto)

    const result = await consumerRepository.findById('1')

    expect(toDomainEntity).toHaveBeenCalledTimes(1)
    expect(repository.findOneBy).toHaveBeenCalledTimes(1)

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' })
    expect(toDomainEntity).toHaveBeenCalledWith(dto)

    expect(result).toEqual(consumidor)
  })

  it('findById method class test using unregistered customer', async () => {
    repository.findOneBy.mockResolvedValue(null)

    const result = await consumerRepository.findById('1')

    expect(toDomainEntity).toHaveBeenCalledTimes(0)
    expect(repository.findOneBy).toHaveBeenCalledTimes(1)

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' })
    expect(result).toEqual(undefined)
  })

  it('save method class test using registered customer', async () => {
    const dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    mockToDto.mockResolvedValue(dto)
    toDomainEntity.mockResolvedValue(consumidor)
    repository.findOneBy.mockResolvedValue(dto)

    const result = await consumerRepository.save(consumidor)

    expect(mockToDto).toHaveBeenCalledTimes(1)
    expect(toDomainEntity).toHaveBeenCalledTimes(1)
    expect(repository.findOneBy).toHaveBeenCalledTimes(1)
    expect(repository.update).toHaveBeenCalledTimes(1)

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: consumidor.id })
    expect(mockToDto).toHaveBeenCalledWith(consumidor)

    expect(result).toEqual(consumidor)
  })

  it('save method class test using unregistered customer', async () => {
    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    repository.findOneBy.mockResolvedValue(null)

    await expect(consumerRepository.save(consumidor)).rejects.toThrow(new BusinessException('Consumidor não encontrado'))
  })

  it('find method class', async () => {
    const dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    toDomainEntity.mockResolvedValue([consumidor])
    repository.find.mockResolvedValue([dto])

    await consumerRepository.find()

    expect(toDomainEntity).toHaveBeenCalledTimes(1)
    expect(repository.find).toHaveBeenCalledTimes(1)
    expect(toDomainEntity).toHaveBeenCalledWith(dto)
  })

  it('findByCPF method class using registered cpf', async () => {
    const cpf = new Cpf('27117957999')

    const dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    toDomainEntity.mockResolvedValue(consumidor)
    repository.findOneBy.mockResolvedValue(dto)

    const result = await consumerRepository.findByCPF(cpf)

    expect(toDomainEntity).toHaveBeenCalledTimes(1)
    expect(repository.findOneBy).toHaveBeenCalledTimes(1)
    expect(toDomainEntity).toHaveBeenCalledWith(dto)
    expect(repository.findOneBy).toHaveBeenCalledWith({ cpf: cpf.toString() })
    expect(result).toEqual(consumidor)
  })

  it('findByCPF method class using unregistered cpf', async () => {
    const cpf = new Cpf('27117957999')

    repository.findOneBy.mockResolvedValue(null)

    const result = await consumerRepository.findByCPF(cpf)

    expect(repository.findOneBy).toHaveBeenCalledTimes(1)
    expect(repository.findOneBy).toHaveBeenCalledWith({ cpf: cpf.toString() })
    expect(result).toEqual(undefined)
  })
})
