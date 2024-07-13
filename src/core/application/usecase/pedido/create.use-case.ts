import { ItemPedidoCreateDto } from '@/core/domain/dto/input/pedido-create.dto'
import Ingrediente from '@/core/domain/entities/ingrediente'
import ItemPedido from '@/core/domain/entities/item-pedido'
import Pedido from '@/core/domain/entities/pedido'
import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'
import BusinessException from '@/core/domain/errors/business-exception'
import { ConsumidorGateway } from '@/core/operation/gateway/consumidor.gateway'
import { PaymentGateway } from '@/core/operation/gateway/payment.gateway'
import { PedidoGateway } from '@/core/operation/gateway/pedido.gateway'
import { ProdutoGateway } from '@/core/operation/gateway/produto.gateway'
import CreatePedidoRequest from '@/infra/web/nestjs/pedidos/dto/create-pedido.request'

export default class Create {
  constructor (
    private readonly gateway: PedidoGateway,
    private readonly consumidorGateway: ConsumidorGateway,
    private readonly produtoGateway: ProdutoGateway,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async handle (input: CreatePedidoRequest): Promise<Pedido> {
    let consumidor
    if (input.consumidorId) {
      consumidor = await this.consumidorGateway.findById(input.consumidorId)
    }

    const itens = await this.buildItens(input.itens)

    let pedido = Pedido.create(
      consumidor,
      itens,
      PedidoStatusEnum.PAGAMENTO_PENDENTE,
    )

    pedido = await this.gateway.create(pedido)

    const pagamentoId = await this.paymentGateway.registerOrder(pedido)
    pedido.pagamentoId = pagamentoId

    await this.gateway.save(pedido)
    return pedido
  }

  private async buildItens (itens: ItemPedidoCreateDto[]): Promise<ItemPedido[]> {
    const itensPromise = itens.map(async (item) => {
      const produto = await this.produtoGateway.findById(item.produtoId)
      if (!produto) {
        throw new BusinessException('Produto não encontrado')
      }
      const ingredientes = item.ingredientesRemovidos.filter((ingredienteId) => produto.ingredientes.some((ingrediente) => ingrediente.id === ingredienteId))
      const ingredientesRemovidos = ingredientes.map((ingredienteId) => new Ingrediente({ id: ingredienteId }))

      return ItemPedido.create(
        produto,
        ingredientesRemovidos,
      )
    })

    return Promise.all(itensPromise)
  }
}
