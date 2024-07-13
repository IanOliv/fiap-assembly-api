import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'
import { Consumidor } from '@/infra/persistence/typeorm/entities/consumidor'
import { ItemPedido } from '@/infra/persistence/typeorm/entities/item-pedido'

@Entity('Pedido')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'consumidor_id', length: 36, nullable: true })
  consumidorId?: string

  @ManyToOne(() => Consumidor, consumidor => consumidor.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'consumidor_id' })
  consumidor?: Consumidor

  @OneToMany(() => ItemPedido, item => item.pedido, {
    cascade: ['insert', 'update', 'remove'],
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  itens: ItemPedido[]

  @Column({ type: 'float' })
  total: number

  @Column({ type: 'varchar', length: 20 })
  status: PedidoStatusEnum

  @Column({ type: 'varchar', length: 36, nullable: true })
  pagamentoId?: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date
}
