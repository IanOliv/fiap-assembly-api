import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { IPedidoRepository } from '@/core/domain/repositories/ipedido.repository'
import { IAssemblyService } from '@/core/domain/services/iassembly.service'
import { IPaymentService } from '@/core/domain/services/ipayment.service'
import IRangoAssemblyService from '@/infra/persistence/service/irango-assembly.service'
import IRangoPaymentService from '@/infra/persistence/service/irango-payment.service'
import { ItemPedido } from '@/infra/persistence/typeorm/entities/item-pedido'
import { Pedido } from '@/infra/persistence/typeorm/entities/pedido'
import PedidoTypeormRepository from '@/infra/persistence/typeorm/repository/pedido-typeorm.repository'
import ConsumidoresModule from '@/infra/web/nestjs/consumidores/consumidores.module'
import PedidosController from '@/infra/web/nestjs/pedidos/pedidos.controller'
import ProdutosModule from '@/infra/web/nestjs/produtos/produtos.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pedido,
      ItemPedido,
    ]),

    ProdutosModule,
    ConsumidoresModule,
  ],
  providers: [
    { provide: IPedidoRepository, useClass: PedidoTypeormRepository },
    { provide: IPaymentService, useClass: IRangoPaymentService },
    { provide: IAssemblyService, useClass: IRangoAssemblyService },

  ],
  controllers: [
    PedidosController
  ],
})
export default class PedidosModule {}
