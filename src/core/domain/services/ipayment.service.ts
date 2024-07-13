import Pedido from '@/core/domain/entities/pedido'

export default interface IPaymentService {
  registerOrder(pedido: Pedido): Promise<string>;
}

export const IPaymentService = Symbol('IPaymentService')
