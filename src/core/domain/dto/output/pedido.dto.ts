import ConsumidorDto from '@/core/domain/dto/output/consumidor.dto'
import ItemPedidoDto from '@/core/domain/dto/output/item-pedido.dto'
import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'

export default interface PedidoDto {
  readonly id?: number;
  readonly consumidorId?: string;
  readonly consumidor?: ConsumidorDto;
  readonly total: number;
  readonly itens: ItemPedidoDto[];
  readonly status: PedidoStatusEnum;
  readonly pagamentoId?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
