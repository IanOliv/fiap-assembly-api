import ConsumidorDto from '@/core/domain/dto/output/consumidor.dto'
import Consumidor from '@/core/domain/entities/consumidor'
import ConsumidorMapper from '@/core/domain/mappers/consumidor.mapper'
import Cpf from '@/core/domain/value-object/Cpf'
import Email from '@/core/domain/value-object/email'

describe('Testing Consumidor Mapper Class', () => {
  it('toDto static method should receive Consumidor Class and return ConsumidorDto class', () => {
    const consumidor = new Consumidor(
      '123456789012345678901234567890123456',
      'Test_Name',
      new Cpf('48538201328'),
      new Email('test@test.com')
    )

    const dto: ConsumidorDto = ConsumidorMapper.toDto(consumidor)

    expect(dto.id).toEqual('123456789012345678901234567890123456')
    expect(dto.nome).toEqual('Test_Name')
    expect(dto.cpf).toEqual('48538201328')
    expect(dto.email).toEqual('test@test.com')
  })

  it('toDomainEntity static method should receive ConsumidorDto Class and return Consumidor class', () => {
    const dto: ConsumidorDto = {
      id: '123456789012345678901234567890123456',
      nome: 'Test_Name',
      cpf: '48538201328',
      email: 'test@test.com'
    }

    const consumidor = ConsumidorMapper.toDomainEntity(dto)

    expect(consumidor).toBeInstanceOf(Consumidor)
  })
})
