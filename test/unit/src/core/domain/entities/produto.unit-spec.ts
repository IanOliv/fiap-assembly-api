import { v4 as uuidv4 } from 'uuid'

import ProdutoUpdateDto from '@/core/domain/dto/input/produto-update.dto'
import Produto from '@/core/domain/entities/produto'
import { ProdutoCategoriaEnum } from '@/core/domain/enums/produto-categoria.enum'
import BusinessException from '@/core/domain/errors/business-exception'

describe('Test Produto Entity Class', () => {
  it('Testing class constructor', () => {
    const produto = new Produto()

    expect(produto).toBeInstanceOf(Produto)
  })

  it('Testing create static method', () => {
    const produto = Produto.create(
      'nome',
      'descricao',
      'imagemUrl',
      1,
      ProdutoCategoriaEnum.BEBIDA
    )

    expect(produto).toBeInstanceOf(Produto)
  })

  it('Testing addIngrediente method exception', () => {
    const produto = Produto.create(
      'nome',
      'descricao',
      'imagemUrl',
      1,
      ProdutoCategoriaEnum.BEBIDA
    )

    produto.addIngrediente(
      new Produto(),
      'nome',
      1,
      'imagemUrl'
    )

    expect(() => produto.addIngrediente(
      new Produto(),
      'nome',
      1,
      'imagemUrl'
    )).toThrow(new BusinessException('Ingrediente já adicionado'))
  })

  it('Testing addIngrediente method', () => {
    const produto = Produto.create(
      'nome',
      'descricao',
      'imagemUrl',
      1,
      ProdutoCategoriaEnum.BEBIDA
    )

    produto.addIngrediente(
      new Produto(),
      'novo_produto',
      1,
      'imagemUrl'
    )

    expect(produto.ingredientes.length).toBeGreaterThan(0)
  })

  it('Testing update method with Ingredient containing id', () => {
    const id = uuidv4()

    const produto = new Produto({
      id,
      nome: 'nome',
      descricao: 'descricao',
      imagemUrl: 'imagemUrl',
      preco: 1,
      categoria: ProdutoCategoriaEnum.BEBIDA,
      ingredientes: []
    })

    const dto: ProdutoUpdateDto = {
      id,
      nome: 'nome',
      imagemUrl: 'imagemUrl',
      descricao: 'descricao',
      preco: 1,
      categoria: ProdutoCategoriaEnum.LANCHE,
      ingredientes: [
        {
          id,
          nome: '',
          imagemUrl: '',
          preco: 1
        }
      ]
    }

    produto.update(dto)

    expect(produto.ingredientes.length).toBeGreaterThan(0)
    expect(produto.categoria).toEqual(ProdutoCategoriaEnum.LANCHE)
  })

  it('Testing update method without Ingredient containing id', () => {
    const id = uuidv4()

    const produto = new Produto({
      id,
      nome: 'nome',
      descricao: 'descricao',
      imagemUrl: 'imagemUrl',
      preco: 1,
      categoria: ProdutoCategoriaEnum.BEBIDA,
      ingredientes: []
    })

    const dto: ProdutoUpdateDto = {
      id,
      nome: 'nome',
      imagemUrl: 'imagemUrl',
      descricao: 'descricao',
      preco: 1,
      categoria: ProdutoCategoriaEnum.LANCHE,
      ingredientes: [
        {
          nome: '',
          imagemUrl: '',
          preco: 1
        }
      ]
    }

    produto.update(dto)

    expect(produto.ingredientes.length).toBeGreaterThan(0)
    expect(produto.categoria).toEqual(ProdutoCategoriaEnum.LANCHE)
  })

  it('Testing delete method', () => {
    const id = uuidv4()

    const produto = new Produto({
      id,
      nome: 'nome',
      descricao: 'descricao',
      imagemUrl: 'imagemUrl',
      preco: 1,
      categoria: ProdutoCategoriaEnum.BEBIDA,
      ingredientes: []
    })

    produto.delete(new Date(1))

    expect(produto.deletedAt).toEqual(new Date(1))
  })
})
