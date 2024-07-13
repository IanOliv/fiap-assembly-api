import { fakerPT_BR as faker } from '@faker-js/faker'
import { v4 as uuidv4 } from 'uuid'

import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'
import IPedidoRepository, {
  IPedidoRepository as IPedidoRepositorySymbol,
} from '@/core/domain/repositories/ipedido.repository'
import { IPaymentService } from '@/core/domain/services/ipayment.service'
import IRangoPaymentService from '@/infra/persistence/service/irango-payment.service'
import { Consumidor } from '@/infra/persistence/typeorm/entities/consumidor'
import { Produto } from '@/infra/persistence/typeorm/entities/produto'
import CreatePedidoRequest from '@/infra/web/nestjs/pedidos/dto/create-pedido.request'
import ItemPedidoResponse from '@/infra/web/nestjs/pedidos/dto/item-pedido.response'
import PedidoResponse from '@/infra/web/nestjs/pedidos/dto/pedido.response'

import IntegrationTestSetup, { ITestSetup } from '@/test/integration/setup/IntegrationTestSetup'
import { Factory } from '@/test/integration/setup/utils/FactoryUtils'

describe('Create Pedido Feature', () => {
  describe('POST /v1/pedidos', () => {
    let setup: ITestSetup
    let produtoFactory: Factory<Produto>
    let pedidoRepository: IPedidoRepository
    let paymentService: IRangoPaymentService

    beforeAll(async () => {
      setup = await IntegrationTestSetup.getInstance()
      produtoFactory = setup.factory.produtoFactory()
      pedidoRepository = setup.app.get<IPedidoRepository>(IPedidoRepositorySymbol)
      paymentService = setup.app.get<IRangoPaymentService>(IPaymentService)
    })

    describe('when everything is valid', () => {
      let produtos: Produto[]

      const buildRequestBody = (consumidor?: Consumidor) => {
        const itens = produtos
          .map((produto: Produto) => {
            const ingredientesCount = faker.number.int({ min: 0, max: produto.ingredientes.length })
            const ingredientesRemovidos = faker.helpers.arrayElements(produto.ingredientes, ingredientesCount)
              .map((ingrediente) => ingrediente.id)
            return {
              produtoId: produto.id,
              ingredientesRemovidos
            }
          })

        const requestBody: CreatePedidoRequest = {
          consumidorId: consumidor?.id,
          itens
        }

        return requestBody
      }

      const buildExpectedResponse = (consumidor?: Consumidor) => {
        const expectedResponse = {
          id: expect.any(Number),
          total: expect.any(Number),
          status: PedidoStatusEnum.PAGAMENTO_PENDENTE,
          pagamentoId: expect.stringMatching(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/),
          createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z/),
          updatedAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z/),
          itens: produtos
            .sort((a, b) => a.id.localeCompare(b.id))
            .map((produto) => ({
              id: expect.stringMatching(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/),
              preco: expect.any(Number),
              produto: {
                id: produto.id,
                nome: produto.nome,
              },
            })),
        }

        return consumidor ? { ...expectedResponse, consumidorId: consumidor.id } : expectedResponse
      }

      const actAndAssert = async (requestBody: CreatePedidoRequest, expectedResponse: PedidoResponse) => {
        // Act
        const { status, body } = await setup.server
          .request('/v1/pedidos')
          .post(requestBody)

        // Assert
        expect(status).toBe(201)

        const itens = (body.data.itens as ItemPedidoResponse[]).sort((a, b) => a.produtoId.localeCompare(b.produtoId))
        expect({ ...body.data, itens }).toMatchObject(expectedResponse)

        const createdPedido = await pedidoRepository.findById(body.data.id)
        expect(createdPedido).toBeDefined()
        expect(createdPedido?.itens).toHaveLength(itens.length)
      }

      beforeEach(async () => {
        produtos = await produtoFactory.createMany(faker.number.int({ min: 1, max: 10 }))
      })

      describe('when there is a consumer', () => {
        let consumidor: Consumidor

        beforeEach(async () => {
          consumidor = await setup.factory.consumidor()
        })

        // eslint-disable-next-line jest/expect-expect
        it('creates a new Pedido', async () => {
          // Arrange
          const requestBody = buildRequestBody(consumidor)
          const expectedResponse = buildExpectedResponse(consumidor)
          jest.spyOn(paymentService, 'registerOrder').mockResolvedValueOnce(uuidv4())

          // Act & Assert
          await actAndAssert(requestBody, expectedResponse as PedidoResponse)
        })
      })

      describe('when there is no a consumer', () => {
        // eslint-disable-next-line jest/expect-expect
        it('creates a new Pedido', async () => {
          // Arrange
          const requestBody = buildRequestBody()
          const expectedResponse = buildExpectedResponse()
          jest.spyOn(paymentService, 'registerOrder').mockResolvedValueOnce(uuidv4())

          // Act & Assert
          await actAndAssert(requestBody, expectedResponse as PedidoResponse)
        })
      })
    })
  })
})
