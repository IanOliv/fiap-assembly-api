import { Repository } from 'typeorm'

import ConsumidorDto from '@/core/domain/dto/output/consumidor.dto'
import PedidoDto from '@/core/domain/dto/output/pedido.dto'
import Consumidor from '@/core/domain/entities/consumidor'
import Pedido from '@/core/domain/entities/pedido'
import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'
import PedidoMapper from '@/core/domain/mappers/pedido.mapper'
import { Pedido as Entity } from '@/infra/persistence/typeorm/entities/pedido'
import PedidoTypeormRepository from '@/infra/persistence/typeorm/repository/pedido-typeorm.repository'

describe('PedidoTypeormRepository Class Tests', () => {
  let pedidoRepository:PedidoTypeormRepository

  let repository:jest.Mocked<Repository<Entity>>

  let mockToDto:jest.Mock<any>
  let toDomainEntity:jest.Mock<any>
  let queryBuilder:any

  beforeEach(() => {
    mockToDto = jest.fn()
    toDomainEntity = jest.fn()

    queryBuilder = {
      leftJoinAndSelect: () => queryBuilder,
      where: () => queryBuilder,
      orderBy: () => queryBuilder,
      addOrderBy: () => queryBuilder,
      getOne: jest.fn(),
      getMany: jest.fn(),
    }

    repository = {
      save: jest.fn(),
      insert: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: () => queryBuilder
    } as unknown as jest.Mocked<Repository<Entity>>

    PedidoMapper.toDto = mockToDto
    PedidoMapper.toDomainEntity = toDomainEntity

    pedidoRepository = new PedidoTypeormRepository(repository)
  })

  it('constructtor class test', async () => {
    expect(pedidoRepository).toBeInstanceOf(PedidoTypeormRepository)
  })

  it('create class method test', async () => {
    const consumidor_dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    const dto: PedidoDto = {
      id: 1,
      consumidorId: '1',
      consumidor: consumidor_dto,
      total: 1,
      itens: [],
      status: PedidoStatusEnum.PREPARACAO,
      pagamentoId: '',
      createdAt: new Date(1),
      updatedAt: new Date(1)
    }

    const pedido:Pedido = Pedido.create(
      consumidor,
      [],
      PedidoStatusEnum.PREPARACAO
    )

    const entity = new Entity()
    entity.consumidor = consumidor_dto
    entity.status = PedidoStatusEnum.PREPARACAO
    entity.consumidorId = '1'
    entity.id = 1
    entity.total = 1
    entity.pagamentoId = '1'
    entity.itens = []

    mockToDto.mockReturnValue(dto)
    toDomainEntity.mockResolvedValue(pedido)
    repository.save.mockResolvedValue(entity)

    await pedidoRepository.create(pedido)

    expect(mockToDto).toHaveBeenCalledTimes(1)
    expect(toDomainEntity).toHaveBeenCalledTimes(1)
    expect(repository.save).toHaveBeenCalledTimes(2)

    expect(mockToDto).toHaveBeenCalledWith(pedido)
    expect(toDomainEntity).toHaveBeenCalledWith(entity)
  })

  it('findById class method test using registered id', async () => {
    const consumidor_dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    const pedido:Pedido = Pedido.create(
      consumidor,
      [],
      PedidoStatusEnum.PREPARACAO
    )

    const entity = new Entity()
    entity.consumidor = consumidor_dto
    entity.status = PedidoStatusEnum.PREPARACAO
    entity.consumidorId = '1'
    entity.id = 1
    entity.total = 1
    entity.pagamentoId = '1'
    entity.itens = []

    queryBuilder.getOne.mockResolvedValue(entity)
    toDomainEntity.mockResolvedValue(pedido)

    await pedidoRepository.findById(1)

    expect(toDomainEntity).toHaveBeenCalledTimes(1)
    expect(queryBuilder.getOne).toHaveBeenCalledTimes(1)
    expect(toDomainEntity).toHaveBeenCalledWith(entity)
  })

  it('findById class method test using not registered id', async () => {
    queryBuilder.getOne.mockResolvedValue(null)

    const result = await pedidoRepository.findById(1)

    expect(toDomainEntity).toHaveBeenCalledTimes(0)
    expect(queryBuilder.getOne).toHaveBeenCalledTimes(1)

    expect(result).toEqual(undefined)
  })

  it('save class method test using registered id', async () => {
    const consumidor_dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    const pedido:Pedido = Pedido.create(
      consumidor,
      [],
      PedidoStatusEnum.PREPARACAO
    )

    const entity = new Entity()
    entity.consumidor = consumidor_dto
    entity.status = PedidoStatusEnum.PREPARACAO
    entity.consumidorId = '1'
    entity.id = 1
    entity.total = 1
    entity.pagamentoId = '1'
    entity.itens = []

    queryBuilder.getOne.mockResolvedValue(entity)
    toDomainEntity.mockResolvedValue(pedido)

    const result = await pedidoRepository.save(pedido)

    expect(queryBuilder.getOne).toHaveBeenCalledTimes(1)
    expect(toDomainEntity).toHaveBeenCalledTimes(1)
    expect(repository.update).toHaveBeenCalledTimes(1)
    expect(toDomainEntity).toHaveBeenCalledWith(entity)
    expect(result).toEqual(pedido)
  })

  it('save class method test using not registered id', async () => {
    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    const pedido:Pedido = Pedido.create(
      consumidor,
      [],
      PedidoStatusEnum.PREPARACAO
    )

    queryBuilder.getOne.mockResolvedValue(null)

    await expect(pedidoRepository.save(pedido)).rejects.toThrow(new Error('Pedido não existe'))
  })

  it('find class method test using not registered id', async () => {
    const consumidor_dto: ConsumidorDto = {
      id: '1',
      nome: 'Test',
      cpf: '27117957999',
      email: 'test@test.com'
    }

    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    const pedido:Pedido = Pedido.create(
      consumidor,
      [],
      PedidoStatusEnum.PREPARACAO
    )

    const entity = new Entity()
    entity.consumidor = consumidor_dto
    entity.status = PedidoStatusEnum.PREPARACAO
    entity.consumidorId = '1'
    entity.id = 1
    entity.total = 1
    entity.pagamentoId = '1'
    entity.itens = []

    queryBuilder.getMany.mockResolvedValue([entity])
    toDomainEntity.mockResolvedValue(pedido)

    await pedidoRepository.find()

    expect(toDomainEntity).toHaveBeenCalledTimes(1)
    expect(queryBuilder.getMany).toHaveBeenCalledTimes(1)
    expect(toDomainEntity).toHaveBeenCalledWith(entity)
  })
})
