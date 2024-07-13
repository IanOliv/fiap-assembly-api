import PedidoUpdateDto from '@/core/domain/dto/input/pedido-update.dto'
import Consumidor from '@/core/domain/entities/consumidor'
import ItemPedido from '@/core/domain/entities/item-pedido'
import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'

export default class Pedido {
  readonly id: number
  consumidorId?: string
  consumidor?: Consumidor
  itens: ItemPedido[]
  total: number
  status: PedidoStatusEnum
  pagamentoId?: string
  createdAt?: Date
  updatedAt?: Date

  public constructor (params?: Partial<Pedido>) {
    Object.assign(this, params)
  }

  static create (
    consumidor: Consumidor | undefined,
    itens: ItemPedido[],
    status: PedidoStatusEnum,
  ): Pedido {
    const total = itens.reduce((acc, item) => {
      return acc + item.preco
    }, 0)

    const pedido = new Pedido({
      consumidor,
      consumidorId: consumidor?.id,
      itens,
      total,
      status,
    })

    return pedido
  }

  update (input: PedidoUpdateDto) {
    this.status = input.status
  }

  recebido () {
    this.status = PedidoStatusEnum.RECEBIDO
  }
}
