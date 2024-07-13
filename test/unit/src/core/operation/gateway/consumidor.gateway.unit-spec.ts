import { v4 as uuidv4 } from 'uuid'

import Consumidor from '@/core/domain/entities/consumidor'
import Repository from '@/core/domain/repositories/iconsumidor.repository'
import Cpf from '@/core/domain/value-object/Cpf'
import Email from '@/core/domain/value-object/email'
import { ConsumidorGateway } from '@/core/operation/gateway/consumidor.gateway'

describe('Test ConsumidorGateway class', () => {
  let gateway:ConsumidorGateway
  let mockRepository:jest.Mocked<Repository>

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCPF: jest.fn(),
      save: jest.fn(),
      find: jest.fn()
    }

    gateway = new ConsumidorGateway(mockRepository)
  })

  it('Testing class constructor', () => {
    expect(gateway).toBeInstanceOf(ConsumidorGateway)
  })

  it('Test findById method returning Consumidor', async () => {
    const id = uuidv4()

    const consumidor = new Consumidor(
      id,
      'Test',
      new Cpf('57965568438'),
      new Email('test@test.com')
    )

    mockRepository.findById.mockResolvedValue(consumidor)

    const result = await gateway.findById('1')

    expect(mockRepository.findById).toHaveBeenCalledWith('1')
    expect(mockRepository.findById).toHaveBeenCalledTimes(1)
    expect(result).toEqual(consumidor)
  })

  it('Test findById method returning undefined Promise', async () => {
    mockRepository.findById.mockResolvedValue(undefined)

    const result = await gateway.findById('1')

    expect(mockRepository.findById).toHaveBeenCalledWith('1')
    expect(mockRepository.findById).toHaveBeenCalledTimes(1)
    expect(result).toEqual(undefined)
  })

  it('Test create method', async () => {
    const id = uuidv4()

    const consumidor = new Consumidor(
      id,
      'Test',
      new Cpf('57965568438'),
      new Email('test@test.com')
    )

    mockRepository.create.mockResolvedValue(consumidor)

    const result = await gateway.create(consumidor)

    expect(mockRepository.create).toHaveBeenCalledWith(consumidor)
    expect(mockRepository.create).toHaveBeenCalledTimes(1)
    expect(result).toEqual(consumidor)
  })

  it('Test findByCPF method returning Consumidor Promise', async () => {
    const id = uuidv4()
    const cpf = new Cpf('57965568438')

    const consumidor = new Consumidor(
      id,
      'Test',
      cpf,
      new Email('test@test.com')
    )

    mockRepository.findByCPF.mockResolvedValue(consumidor)

    const result = await gateway.findByCPF(cpf)

    expect(mockRepository.findByCPF).toHaveBeenCalledWith(cpf)
    expect(mockRepository.findByCPF).toHaveBeenCalledTimes(1)
    expect(result).toEqual(consumidor)
  })

  it('Test findByCPF method returning undefined Promise', async () => {
    const cpf = new Cpf('57965568438')
    mockRepository.findByCPF.mockResolvedValue(undefined)

    const result = await gateway.findByCPF(cpf)

    expect(mockRepository.findByCPF).toHaveBeenCalledWith(cpf)
    expect(mockRepository.findByCPF).toHaveBeenCalledTimes(1)
    expect(result).toEqual(undefined)
  })

  it('Test save method', async () => {
    const id = uuidv4()
    const cpf = new Cpf('57965568438')

    const consumidor = new Consumidor(
      id,
      'Test',
      cpf,
      new Email('test@test.com')
    )

    mockRepository.save.mockResolvedValue(consumidor)

    const result = await gateway.save(consumidor)

    expect(mockRepository.save).toHaveBeenCalledWith(consumidor)
    expect(mockRepository.save).toHaveBeenCalledTimes(1)
    expect(result).toEqual(consumidor)
  })

  it('Test find method', async () => {
    const id = uuidv4()
    const cpf = new Cpf('57965568438')

    const consumidor = new Consumidor(
      id,
      'Test',
      cpf,
      new Email('test@test.com')
    )

    mockRepository.find.mockResolvedValue([consumidor])

    const result = await gateway.find()

    expect(mockRepository.find).toHaveBeenCalledTimes(1)
    expect(result).toEqual([consumidor])
  })
})
