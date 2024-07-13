import { ProdutoCategoriaEnum } from '@/core/domain/enums/produto-categoria.enum'
import { Produto } from '@/infra/persistence/typeorm/entities/produto'

test('Produto class should be initialized through constructor', () => {
  const produto = new Produto({
    id: '123456789012345678901234567890123456',
    nome: 'Test_Product',
    imagemUrl: 'test_url.com',
    descricao: 'test description',
    preco: 1,
    categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
    ingredientes: [],
    deletedAt: new Date(1)
  })

  expect(produto).toEqual({
    id: '123456789012345678901234567890123456',
    nome: 'Test_Product',
    imagemUrl: 'test_url.com',
    descricao: 'test description',
    preco: 1,
    categoria: ProdutoCategoriaEnum.ACOMPANHAMENTO,
    ingredientes: [],
    deletedAt: new Date(1)
  })
})
