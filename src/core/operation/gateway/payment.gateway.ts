import Pedido from '@/core/domain/entities/pedido'
import IPaymentService from '@/core/domain/services/ipayment.service'

export class PaymentGateway {
  constructor (private respository: IPaymentService) {

  }

  async registerOrder (pedido: Pedido): Promise<string> {
    return this.respository.registerOrder(pedido)
  }
}
