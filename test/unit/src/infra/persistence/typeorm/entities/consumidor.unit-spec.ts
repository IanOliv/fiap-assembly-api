import { Consumidor } from '@/infra/persistence/typeorm/entities/consumidor'

test('Consumidor class should be initialized through constructor', () => {
  const consumidor = new Consumidor({
    id: '123456789012345678901234567890123456',
    nome: 'Test_Name',
    cpf: '11122233344',
    email: 'test@test.com'
  })

  expect(consumidor).toEqual({
    id: '123456789012345678901234567890123456',
    nome: 'Test_Name',
    cpf: '11122233344',
    email: 'test@test.com'
  })
})
