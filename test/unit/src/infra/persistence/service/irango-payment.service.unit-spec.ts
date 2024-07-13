import axios from 'axios'

import Consumidor from '@/core/domain/entities/consumidor'
import Pedido from '@/core/domain/entities/pedido'
import { PedidoStatusEnum } from '@/core/domain/enums/pedido-status.enum'
import IRangoPaymentService from '@/infra/persistence/service/irango-payment.service'
import { Environment as envs } from '@/infra/web/nestjs/environment'

describe('IRangoPaymentService Class Tests', () => {
  let service:IRangoPaymentService
  let mockPost:jest.Mock<any>

  beforeEach(() => {
    jest.mock('axios')
    mockPost = jest.fn()
    axios.post = mockPost
    service = new IRangoPaymentService()
  })

  it('constructor class test', () => {
    expect(service).toBeInstanceOf(IRangoPaymentService)
  })

  it('Test success call on registerOrder method', async () => {
    const url = `${envs.SERVICE_IRANGO_PAYMENT_API}/v1/pedidos/register`
    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    const pedido:Pedido = Pedido.create(
      consumidor,
      [],
      PedidoStatusEnum.PREPARACAO
    )

    mockPost.mockResolvedValue({
      data: {
        data: {
          pagamentoId: 'mock_id'
        }
      }
    })

    const result = await service.registerOrder(pedido)

    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(mockPost).toHaveBeenCalledWith(url, pedido)
    expect(result).toEqual('mock_id')
  })

  it('Test failed call on registerOrder method', async () => {
    const url = `${envs.SERVICE_IRANGO_PAYMENT_API}/v1/pedidos/register`
    const consumidor:Consumidor = Consumidor.create('Test', '27117957999', 'test@test.com')

    const pedido:Pedido = Pedido.create(
      consumidor,
      [],
      PedidoStatusEnum.PREPARACAO
    )

    mockPost.mockImplementation(() => {
      throw new Error('Mocked Error')
    })

    const result = await service.registerOrder(pedido)

    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(mockPost).toHaveBeenCalledWith(url, pedido)
    expect(result).toEqual('null')
  })
})
