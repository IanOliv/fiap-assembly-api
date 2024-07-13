import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { Produto } from './produto'

@Entity('Ingrediente')
export class Ingrediente {
  constructor (params?: Partial<Ingrediente>) {
    Object.assign(this, params)
  }

  @PrimaryColumn({ length: 36 })
  id: string

  @Column()
  nome: string

  @Column({ name: 'imagem_url', nullable: true })
  imagemUrl?: string

  @Column({ type: 'float', nullable: true })
  preco?: number

  @Column({ name: 'produto_id', length: 36, nullable: true })
  public produtoId?: string

  @ManyToOne(() => Produto, (produto) => produto.ingredientes)
  @JoinColumn({ name: 'produto_id' })
  produto: Produto
}
