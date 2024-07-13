import Ingrediente from '@/core/domain/entities/ingrediente'
import Produto from '@/core/domain/entities/produto'

describe('Test Ingrediente Entity Class', () => {
  it('Testing class constructor', () => {
    const ingrediente = new Ingrediente({
      id: '',
      nome: '',
      imagemUrl: '',
      preco: 1,
      produtoId: ''
    })

    expect(ingrediente).toBeInstanceOf(Ingrediente)
  })

  it('Testing create static method', () => {
    const ingrediente = Ingrediente.create(
      new Produto(),
      'nome',
      'imagemUrl',
      1
    )

    expect(ingrediente).toBeInstanceOf(Ingrediente)
  })
})
