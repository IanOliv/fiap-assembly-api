import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import IConsumidorRepository, {
  IConsumidorRepository as IConsumidorRepositorySymbol,
} from '@/core/domain/repositories/iconsumidor.repository'
import IPedidoRepository, {
  IPedidoRepository as IPedidoRepositorySymbol,
} from '@/core/domain/repositories/ipedido.repository'
import IProdutoRepository, {
  IProdutoRepository as IProdutoRepositorySymbol,
} from '@/core/domain/repositories/iproduto.repository'
import IAssemblyService, {
  IAssemblyService as IAssemblyServiceSymbol,
} from '@/core/domain/services/iassembly.service'
import IPaymentService, {
  IPaymentService as IPaymentServiceSymbol,
} from '@/core/domain/services/ipayment.service'
import { PedidoController } from '@/core/operation/controllers/pedido.controller'
import PedidoResponse from '@/infra/web/nestjs/pedidos/dto/pedido.response'
import UpdatePedidoRequest from '@/infra/web/nestjs/pedidos/dto/update-pedido.request'

import CreatePedidoRequest from './dto/create-pedido.request'

@Controller('v1/pedidos')
@ApiTags('v1/pedidos')
export default class PedidosController {
  constructor (
    @Inject(IPedidoRepositorySymbol) private readonly repository: IPedidoRepository,
    @Inject(IConsumidorRepositorySymbol) private readonly consumidorRepository: IConsumidorRepository,
    @Inject(IProdutoRepositorySymbol) private readonly produtoRepository: IProdutoRepository,
    @Inject(IPaymentServiceSymbol) private readonly paymentService: IPaymentService,
    @Inject(IAssemblyServiceSymbol) private readonly assemblyService: IAssemblyService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os Pedidos' })
  @ApiOkResponse({ description: 'Todos os Pedidos', type: [PedidoResponse], isArray: true })
  list (): Promise<PedidoResponse[]> {
    const controller = new PedidoController(
      this.repository,
      this.consumidorRepository,
      this.produtoRepository,
      this.paymentService,
      this.assemblyService,
    )

    return controller.list()
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo Pedido' })
  @ApiBody({ type: CreatePedidoRequest })
  @ApiCreatedResponse({ description: 'Registro criado', type: PedidoResponse })
  create (
    @Body() input: CreatePedidoRequest
  ): Promise<PedidoResponse> {
    const controller = new PedidoController(
      this.repository,
      this.consumidorRepository,
      this.produtoRepository,
      this.paymentService,
      this.assemblyService,
    )

    return controller.create(input)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um Pedido' })
  @ApiParam({ name: 'id', required: true, example: 12345 })
  @ApiBody({ type: UpdatePedidoRequest })
  @ApiOkResponse({ description: 'O registro atualizado', type: PedidoResponse })
  update (
    @Param('id') id: number,
    @Body() input: UpdatePedidoRequest
  ): Promise<PedidoResponse> {
    const controller = new PedidoController(
      this.repository,
      this.consumidorRepository,
      this.produtoRepository,
      this.paymentService,
      this.assemblyService,
    )

    return controller.update(id, input)
  }

  @Post('/payment-webhook/confirm/:id')
  @ApiOperation({ summary: 'Receber e processar o evento de confirmação de pagamento de um Pedido a partir do serviço irango-payment' })
  @ApiParam({ name: 'id', required: true, example: 12345 })
  @ApiOkResponse({ description: 'O registro atualizado', type: PedidoResponse })
  confirmPayment (
    @Param('id') id: number,
  ): Promise<PedidoResponse> {
    const controller = new PedidoController(
      this.repository,
      this.consumidorRepository,
      this.produtoRepository,
      this.paymentService,
      this.assemblyService,
    )

    return controller.confirmPayment(id)
  }

  @Post('/assembly-webhook/start/:id')
  @ApiOperation({ summary: 'Receber e processar o evento de início de preparo de um Pedido a partir do serviço irango-assembly' })
  @ApiParam({ name: 'id', required: true, example: 12345 })
  @ApiOkResponse({ description: 'O registro atualizado', type: PedidoResponse })
  StartAssembly (
    @Param('id') id: number,
  ): Promise<PedidoResponse> {
    const controller = new PedidoController(
      this.repository,
      this.consumidorRepository,
      this.produtoRepository,
      this.paymentService,
      this.assemblyService,
    )

    return controller.StartAssembly(id)
  }

  @Post('/assembly-webhook/finish/:id')
  @ApiOperation({ summary: 'Receber e processar o evento de finalização de preparo de um Pedido a partir do serviço irango-assembly' })
  @ApiParam({ name: 'id', required: true, example: 12345 })
  @ApiOkResponse({ description: 'O registro atualizado', type: PedidoResponse })
  FinishAssembly (
    @Param('id') id: number,
  ): Promise<PedidoResponse> {
    const controller = new PedidoController(
      this.repository,
      this.consumidorRepository,
      this.produtoRepository,
      this.paymentService,
      this.assemblyService,
    )

    return controller.FinishAssembly(id)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Encontrar um Pedido por ID' })
  @ApiParam({ name: 'id', required: true, example: 12345 })
  @ApiOkResponse({ description: 'O registro encontrado', type: PedidoResponse })
  findById (
    @Param('id') id: number,
  ): Promise<PedidoResponse> {
    const controller = new PedidoController(
      this.repository,
      this.consumidorRepository,
      this.produtoRepository,
      this.paymentService,
      this.assemblyService,
    )

    return controller.findById(id)
  }
}
