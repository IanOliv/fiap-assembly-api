import PedidoDto from '@/core/domain/dto/output/pedido.dto'
import Consumidor from '@/core/domain/entities/consumidor'
import ItemPedido from '@/core/domain/entities/item-pedido'
import Pedido from '@/core/domain/entities/pedido'
import Produto from '@/core/domain/entities/produto'
import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'
import { ProdutoCategoriaEnum } from '@/core/domain/enums/produto-categoria.enum'
import PedidoMapper from '@/core/domain/mappers/pedido.mapper'

describe('Testing PedidoMapper Class', () => {
  it('toDto static method when consumidor is provided', () => {
    const consumidor = Consumidor.create('test', '57965568438', 'test@test.com')
    const produto = new Produto({
      id: '',
      nome: '',
      descricao: '',
      preco: 1,
      imagemUrl: '',
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: [],
      deletedAt: new Date(1)
    })

    const items = new ItemPedido({
      id: '1',
      produtoId: '1',
      produto,
      preco: 1,
      ingredientesRemovidos: []
    })

    const pedido = new Pedido({
      id: 1,
      itens: [items],
      total: 1,
      status: PedidoStatusEnum.PAGAMENTO_PENDENTE,
      consumidor
    })

    const dto = PedidoMapper.toDto(pedido)

    expect(dto.total).toEqual(1)
    expect(dto.status).toEqual(PedidoStatusEnum.PAGAMENTO_PENDENTE)
  })

  it('toDto static method should receive Pedido Class and return PedidoDto class', () => {
    const produto = new Produto({
      id: '',
      nome: '',
      descricao: '',
      preco: 1,
      imagemUrl: '',
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: [],
      deletedAt: new Date(1)
    })

    const items = new ItemPedido({
      id: '1',
      produtoId: '1',
      produto,
      preco: 1,
      ingredientesRemovidos: []
    })

    const pedido = new Pedido({
      id: 1,
      itens: [items],
      total: 1,
      status: PedidoStatusEnum.PAGAMENTO_PENDENTE
    })

    const dto = PedidoMapper.toDto(pedido)

    expect(dto.total).toEqual(1)
    expect(dto.status).toEqual(PedidoStatusEnum.PAGAMENTO_PENDENTE)
  })

  it('toDomainEntity static method should receive PedidoDto Class and return Pedido class when consumidor is provided', () => {
    const consumidor = {
      id: '1',
      nome: 'test',
      cpf: '57965568438',
      email: 'test@test.com'
    }

    const produto = {
      id: '',
      nome: '',
      descricao: '',
      preco: 1,
      imagemUrl: '',
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: [],
      deletedAt: new Date(1)
    }

    const items = {
      id: '1',
      produtoId: '1',
      produto,
      preco: 1,
      ingredientesRemovidos: []
    }

    const dto:PedidoDto = {
      id: 1,
      consumidorId: '',
      total: 1,
      itens: [items],
      status: PedidoStatusEnum.PAGAMENTO_PENDENTE,
      pagamentoId: '',
      createdAt: new Date(1),
      updatedAt: new Date(1),
      consumidor
    }

    const pedido = PedidoMapper.toDomainEntity(dto)

    expect(pedido).toBeInstanceOf(Pedido)
  })

  it('toDomainEntity static method should receive PedidoDto Class and return Pedido class', () => {
    const produto = {
      id: '',
      nome: '',
      descricao: '',
      preco: 1,
      imagemUrl: '',
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: [],
      deletedAt: new Date(1)
    }

    const items = {
      id: '1',
      produtoId: '1',
      produto,
      preco: 1,
      ingredientesRemovidos: []
    }

    const dto:PedidoDto = {
      id: 1,
      consumidorId: '',
      total: 1,
      itens: [items],
      status: PedidoStatusEnum.PAGAMENTO_PENDENTE,
      pagamentoId: '',
      createdAt: new Date(1),
      updatedAt: new Date(1)
    }

    const pedido = PedidoMapper.toDomainEntity(dto)

    expect(pedido).toBeInstanceOf(Pedido)
  })
})
