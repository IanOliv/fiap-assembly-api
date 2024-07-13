
import { When, Then, Given, After, AfterAll, Before, BeforeAll } from '@cucumber/cucumber'
import { faker } from '@faker-js/faker'
import * as assert from 'assert'

import Consumidor from '@/core/domain/entities/consumidor'
import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'
import { Produto } from '@/infra/persistence/typeorm/entities/produto'
import CreatePedidoRequest from '@/infra/web/nestjs/pedidos/dto/create-pedido.request'

// import ItemPedidoResponse from '@/infra/web/nestjs/pedidos/dto/item-pedido.response';
import { Factory } from '@/test/integration/setup/utils/FactoryUtils'

import IntegrationTestSetup, { ITestSetup } from '../../integration/setup/IntegrationTestSetup'

let setup: ITestSetup
let consumidor: Consumidor | undefined
let produtoFactory: Factory<Produto>
let produtos: Produto[]

BeforeAll(async () => {
  setup = await IntegrationTestSetup.getInstance()
  produtoFactory = setup.factory.produtoFactory()
  await setup.db.truncateAll()
  await setup.app.init()
})

Before(async () => {
  produtos = await produtoFactory.createMany(faker.number.int({ min: 1, max: 10 }))
})

AfterAll(async () => {
  setup = await IntegrationTestSetup.getInstance()
  await setup.db.truncateAll()
  await setup.module.close()
  await setup.app.close()
})

After(async () => {
  setup = await IntegrationTestSetup.getInstance()
  await setup.db.truncateAll()
})

const buildRequestBody = (consu?: Consumidor) => {
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
    consumidorId: consu?.id,
    itens
  }

  return requestBody
}

// const buildExpectedResponse = (consumidor?: Consumidor) => {
//   const expectedResponse = {
//     id: expect.any(Number),
//     total: expect.any(Number),
//     status: PedidoStatusEnum.PAGAMENTO_PENDENTE,
//     pagamentoId: expect.stringMatching(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/),
//     createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z/),
//     updatedAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z/),
//     itens: produtos
//       .sort((a, b) => a.id.localeCompare(b.id))
//       .map((produto) => ({
//         id: expect.stringMatching(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/),
//         preco: expect.any(Number),
//         produto: {
//           id: produto.id,
//           nome: produto.nome,
//         },
//       })),
//   }

//   return consumidor ? { ...expectedResponse, consumidorId: consumidor.id } : expectedResponse
// }

let response: any

Given('que sou consumidor identificado', async function () {
  consumidor = await setup.factory.consumidor()
})

Given('que sou consumidor não identificado', function () {
  consumidor = undefined
})

When('criar um pedido', async function () {
  const requestBody = buildRequestBody(consumidor)

  response = await setup.server
    .request('/v1/pedidos')
    .post(requestBody)
})

Then('o pedido é criado com sucesso', function () {
  // const expectedResponse = buildExpectedResponse(consumidor)

  // expect(response.status).toBe(201)
  assert.equal(response.status, 201)

  // const itens = (response.body.data.itens as ItemPedidoResponse[]).sort((a, b) => a.produtoId.localeCompare(b.produtoId))

  assert.equal(response.body.data.status, PedidoStatusEnum.PAGAMENTO_PENDENTE)
  // expect({ ...response.body.data, itens }).toMatchObject(expectedResponse)
})
