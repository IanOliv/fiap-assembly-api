import Ingrediente from '@/core/domain/entities/ingrediente'
import Produto from '@/core/domain/entities/produto'
import { ProdutoCategoriaEnum } from '@/core/domain/enums/produto-categoria.enum'
import ProdutoMapper from '@/core/domain/mappers/produto.mapper'

describe('Testing ProdutoMapper Class', () => {
  it('toDto static method should receive Produto Class and return ProdutoDto class', () => {
    const produto = new Produto({
      id: '',
      nome: '',
      descricao: '',
      preco: 1,
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: []
    })

    const dto = ProdutoMapper.toDto(produto)

    expect(dto.id).toEqual('')
    expect(dto.nome).toEqual('')
    expect(dto.descricao).toEqual('')
    expect(dto.preco).toEqual(1)
    expect(dto.categoria).toEqual(ProdutoCategoriaEnum.ACOMPANHAMENTO)
    expect(dto.ingredientes).toEqual([])
  })

  it('toDomainEntity static method should receive ProdutoDto Class and return Produto class', () => {
    const ingrediente = new Ingrediente({
      id: '1',
      nome: 'test',
      imagemUrl: 'test',
      preco: 1,
      produtoId: '1'
    })

    const dto = {
      id: '',
      nome: '',
      descricao: '',
      preco: 1,
      imagemUrl: '',
      categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
      ingredientes: [ingrediente],
      deletedAt: new Date(1)
    }

    const produto = ProdutoMapper.toDomainEntity(dto)

    expect(produto).toBeInstanceOf(Produto)
  })
})
