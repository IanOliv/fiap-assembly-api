import ItemPedido from '@/core/domain/entities/item-pedido'
import Produto from '@/core/domain/entities/produto'

describe('Test ItemPedido Entity Class', () => {
  it('Testing class constructor', () => {
    const itemPedido = new ItemPedido()
    expect(itemPedido).toBeInstanceOf(ItemPedido)
  })

  it('Testing create static method', () => {
    const itemPedido = ItemPedido.create(
      new Produto(),
      []
    )

    expect(itemPedido).toBeInstanceOf(ItemPedido)
  })
})
