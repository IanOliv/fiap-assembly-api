import Pedido from '@/core/domain/entities/pedido'
import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'
import BusinessException from '@/core/domain/errors/business-exception'
import { PedidoGateway } from '@/core/operation/gateway/pedido.gateway'

export default class FinishAssembly { 
  constructor (
    private readonly gateway: PedidoGateway,
  ) {}

  async handle (id: number): Promise<Pedido> {
    const pedido = await this.gateway.findById(id)

    if (!pedido) {
      throw new BusinessException('Pedido não encontrado')
    }

    if (![PedidoStatusEnum.PREPARACAO, PedidoStatusEnum.PRONTO].includes(pedido.status)) {
      throw new BusinessException('Pedido não está com status PREPARAÇÃO')
    }

    pedido.update({ status: PedidoStatusEnum.PRONTO })

    await this.gateway.save(pedido)

    return pedido
  }
}
