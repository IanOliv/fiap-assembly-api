import { v4 as uuidv4 } from 'uuid'

import ConsumidorUpdateDto from '@/core/domain/dto/input/consumidor-update.dto'
import Consumidor from '@/core/domain/entities/consumidor'
import Cpf from '@/core/domain/value-object/Cpf'
import Email from '@/core/domain/value-object/email'

describe('Test Consumidor Entity Class', () => {
  it('Testing class constructor', () => {
    const consumidor = new Consumidor(
      'id',
      'nome',
      new Cpf('48538201328'),
      new Email('test@test.com')
    )

    expect(consumidor).toBeInstanceOf(Consumidor)
  })

  it('Testing create static method', () => {
    const consumidor = Consumidor.create(
      'nome',
      '48538201328',
      'test@test.com'
    )

    expect(consumidor).toBeInstanceOf(Consumidor)
  })

  it('Testing update static method', () => {
    const id = uuidv4()

    const dto:ConsumidorUpdateDto = {
      id,
      nome: 'Test',
      email: 'test@test.com',
      cpf: '57965568438'
    }

    const consumidor = new Consumidor(
      id,
      'nome',
      new Cpf('48538201328'),
      new Email('test@test.com')
    )

    consumidor.update(dto)

    expect(consumidor.id).toEqual(id)
    expect(consumidor.nome).toEqual('Test')
    expect(consumidor.email).toEqual(new Email('test@test.com'))
    expect(consumidor.cpf).toEqual(new Cpf('57965568438'))
  })
})
