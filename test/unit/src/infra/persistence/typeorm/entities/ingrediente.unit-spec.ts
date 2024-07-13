import { Ingrediente } from '@/infra/persistence/typeorm/entities/ingrediente'
import { Produto } from '@/infra/persistence/typeorm/entities/produto'

test('Ingrediente class should be initialized through constructor', () => {
  const ingrediente = new Ingrediente({
    id: '123456789012345678901234567890123456',
    nome: 'Test_Name',
    imagemUrl: '11122233344',
    preco: 1,
    produtoId: '123456789012345678901234567890123456',
    produto: new Produto()
  })

  expect(ingrediente).toEqual({
    id: '123456789012345678901234567890123456',
    nome: 'Test_Name',
    imagemUrl: '11122233344',
    preco: 1,
    produtoId: '123456789012345678901234567890123456',
    produto: new Produto()
  })
})
