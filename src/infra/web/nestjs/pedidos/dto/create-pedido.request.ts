import { ApiProperty } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'

import PedidoCreateDto, { ItemPedidoCreateDto } from '@/core/domain/dto/input/pedido-create.dto'

class CreateItemPedidoRequest implements ItemPedidoCreateDto {
  @ApiProperty({
    example: 'f1453a0d-4b53-4ff9-8b17-709e089ca805',
    description: 'ID do Produto no formato uuid',
    type: String,
    required: true,
  })
  readonly produtoId: string

  @ApiProperty({
    example: ['29d17f4f-1197-4fc4-9b30-e86729644361', 'fca63f61-a18d-4a2c-90a7-070567e2c948'],
    description: 'IDs dos Ingredientes a serem retirados do Produto',
    type: [String],
    isArray: true,
    required: false,
  })
  readonly ingredientesRemovidos: string[]
}

export default class CreatePedidoRequest implements PedidoCreateDto {
  @ApiProperty({
    example: 'f1453a0d-4b53-4ff9-8b17-709e089ca805',
    description: 'ID do Consumidor no formato uuid',
    type: String,
    required: false,
  })
  readonly consumidorId?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemPedidoRequest)
  @ApiProperty({
    description: 'Itens do Pedido',
    type: [CreateItemPedidoRequest],
  })
  readonly itens: CreateItemPedidoRequest[]
}
