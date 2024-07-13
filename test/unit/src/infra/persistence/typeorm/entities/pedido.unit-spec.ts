import { Pedido } from '@/infra/persistence/typeorm/entities/pedido'

test('Pedido class should be initialized through constructor', () => {
  const pedido = new Pedido()
  expect(pedido).toEqual({})
})
