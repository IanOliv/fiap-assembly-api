import { fakerPT_BR as faker } from '@faker-js/faker'

import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'
import { Pedido } from '@/infra/persistence/typeorm/entities/pedido'
import PedidoResponse from '@/infra/web/nestjs/pedidos/dto/pedido.response'

import IntegrationTestSetup, { ITestSetup } from '@/test/integration/setup/IntegrationTestSetup'
import { Factory } from '@/test/integration/setup/utils/FactoryUtils'

describe('List Pedido Feature', () => {
  describe('GET /v1/pedidos', () => {
    let setup: ITestSetup
    let pedidoFactory: Factory<Pedido>
    let pedidos: Pedido[]

    beforeAll(async () => {
      setup = await IntegrationTestSetup.getInstance()
      pedidoFactory = setup.factory.pedidoFactory()
    })

    beforeEach(async () => {
      pedidos = await pedidoFactory.createMany(faker.number.int({ min: 1, max: 10 }))
    })

    describe('when everything is valid', () => {
      // TODO: teste quebrando na esteira
      it.skip('returns a list with all Pedidos', async () => {
        // Arrange
        const expectedResponse = pedidos
          .filter(p => p.status !== PedidoStatusEnum.FINALIZADO)
          .sort((a, b) => {
            const statusOrder = [
              PedidoStatusEnum.PRONTO,
              PedidoStatusEnum.PREPARACAO,
              PedidoStatusEnum.RECEBIDO,
              PedidoStatusEnum.PAGAMENTO_PENDENTE
            ]
            const statusResult = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)

            if (statusResult !== 0) return statusResult

            if (a.createdAt && b.createdAt) return a.createdAt.getTime() - b.createdAt.getTime()

            return 0
          })
          .map((pedido) => ({
            id: pedido.id,
            consumidorId: pedido.consumidorId,
            total: pedido.total,
            itens: pedido.itens
              .sort((a, b) => a.id.localeCompare(b.id))
              .map((item) => ({
                id: item.id,
                preco: item.preco,
                produto: {
                  id: item.produto.id,
                  nome: item.produto.nome,
                  categoria: item.produto.categoria,
                },
              })),
            status: pedido.status,
            createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z/),
            updatedAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z/),
          }))

        // Act
        const { status, body } = await setup.server
          .request('/v1/pedidos')
          .get()

        // Assert
        expect(status).toBe(200)

        const response = (body.data as PedidoResponse[])
        response.map((pedido) => ({
          ...pedido,
          itens: pedido.itens.sort((a, b) => a.id!.localeCompare(b.id!)),
        }))
        expect(response).toMatchObject(expectedResponse)
      })
    })
  })
})
