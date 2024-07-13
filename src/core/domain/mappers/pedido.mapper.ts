import PedidoDto from '@/core/domain/dto/output/pedido.dto'
import Pedido from '@/core/domain/entities/pedido'
import ConsumidorMapper from '@/core/domain/mappers/consumidor.mapper'
import ItemPedidoMapper from '@/core/domain/mappers/item-pedido.mapper'

export default class PedidoMapper {
  static toDto (pedido: Pedido): PedidoDto {
    const consumidor = pedido.consumidor ? ConsumidorMapper.toDto(pedido.consumidor) : undefined
    return {
      id: pedido.id,
      consumidorId: pedido.consumidorId,
      consumidor,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      itens: pedido.itens?.map(item => ItemPedidoMapper.toDto(item)),
      total: pedido.total,
      status: pedido.status,
      pagamentoId: pedido.pagamentoId,
      createdAt: pedido.createdAt,
      updatedAt: pedido.updatedAt
    }
  }

  static toDomainEntity (input: PedidoDto): Pedido {
    const consumidor = input.consumidor ? ConsumidorMapper.toDomainEntity(input.consumidor) : undefined
    return new Pedido({
      id: input.id,
      consumidorId: input.consumidorId,
      consumidor,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      itens: input.itens?.map(item => ItemPedidoMapper.toDomainEntity(item)),
      total: input.total,
      status: input.status,
      pagamentoId: input.pagamentoId,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt
    })
  }
}
