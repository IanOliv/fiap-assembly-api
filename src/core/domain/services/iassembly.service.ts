import Pedido from '@/core/domain/entities/pedido'

export default interface IAssemblyService {
  registerOrder(pedido: Pedido): Promise<void>;
}

export const IAssemblyService = Symbol('IAssemblyService')
