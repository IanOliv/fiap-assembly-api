import Pedido from '@/core/domain/entities/pedido'
import IAssemblyService from '@/core/domain/services/iassembly.service'

export class AssemblyGateway {
  constructor (private respository: IAssemblyService) {

  }

  async registerOrder (pedido: Pedido): Promise<void> {
    return this.respository.registerOrder(pedido)
  }
}
