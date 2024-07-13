import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'

import { ProdutoCategoriaEnum } from '@/core/domain/enums/produto-categoria.enum'

import { Ingrediente } from './ingrediente'

@Entity('Produto')
export class Produto {
  constructor (params?: Partial<Produto>) {
    Object.assign(this, params)
  }

  @PrimaryColumn({ length: 36 })
  id: string

  @Column()
  nome: string

  @Column({ name: 'imagem_url', nullable: true })
  imagemUrl?: string

  @Column({ type: 'text' })
  descricao: string

  @Column({ type: 'float' })
  preco: number

  @Column({ type: 'varchar', length: 20 })
  categoria: ProdutoCategoriaEnum

  @OneToMany(() => Ingrediente, (ingrediente) => ingrediente.produto, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  ingredientes: Ingrediente[]

  @Column({
    name: 'deleted_at',
    type: 'datetime',
    nullable: true
  })
  deletedAt?: Date
}
