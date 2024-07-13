import { ItemPedido } from '@/infra/persistence/typeorm/entities/item-pedido'

test('ItemPedido class should be initialized through constructor', () => {
  const itemPedido = new ItemPedido()
  expect(itemPedido).toEqual({})
})
