import Pedido from '@/core/domain/entities/pedido'
import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'

describe('Test Pedido Entity Class', () => {
  it('Testing class constructor', () => {
    const pedido = new Pedido()
    expect(pedido).toBeInstanceOf(Pedido)
  })

  it('Testing create static method', () => {
    const pedido = Pedido.create(
      undefined,
      [],
      PedidoStatusEnum.PRONTO
    )

    expect(pedido).toBeInstanceOf(Pedido)
  })

  it('Testing update method', () => {
    const pedido = Pedido.create(
      undefined,
      [],
      PedidoStatusEnum.PREPARACAO
    )

    pedido.update({
      status: PedidoStatusEnum.PRONTO
    })

    expect(pedido.status).toEqual(PedidoStatusEnum.PRONTO)
  })

  it('Testing recebido method', () => {
    const pedido = Pedido.create(
      undefined,
      [],
      PedidoStatusEnum.PAGAMENTO_PENDENTE
    )

    pedido.recebido()

    expect(pedido.status).toEqual(PedidoStatusEnum.RECEBIDO)
  })
})
