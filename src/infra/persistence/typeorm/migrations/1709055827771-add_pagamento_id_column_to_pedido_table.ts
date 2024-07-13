import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPagamentoGatewayColumnToPedidoTable1709055827771 implements MigrationInterface {
    name = 'AddPagamentoGatewayColumnToPedidoTable1709055827771'

    public async up (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `Pedido` ADD `pagamentoId` varchar(36) NULL')
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `Pedido` DROP COLUMN `pagamentoId`')
    }
}
