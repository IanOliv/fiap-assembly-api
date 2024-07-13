import BusinessException from '@/core/domain/errors/business-exception'
import Cpf from '@/core/domain/value-object/Cpf'

describe('Test of Cpf Value-Object class', () => {
  it('Test constructor class with validate as true using valid cpf', () => {
    const cpf = new Cpf('57965568438')
    expect(cpf).toBeInstanceOf(Cpf)
  })

  it('Test constructor class with validate as true using invalid cpf', () => {
    expect(() => {
      const cpf = new Cpf('11122233344')
      cpf.toString()
    }).toThrow(new BusinessException('Invalid cpf'))
  })

  it('Test constructor class with validate as false', () => {
    const cpf = new Cpf('57965568438', false)
    expect(cpf).toBeInstanceOf(Cpf)
  })

  it('Test getValue method', () => {
    const cpf = new Cpf('57965568438')
    expect(cpf.getValue()).toEqual('57965568438')
  })

  it('Test toString method', () => {
    const cpf = new Cpf('57965568438')
    expect(cpf.toString()).toEqual('57965568438')
  })

  it('Test mock value', () => {
    const cpf = new Cpf('12345678900')
    expect(cpf.toString()).toEqual('12345678900')
  })

  it('Test number same exception', () => {
    expect(() => {
      const cpf = new Cpf('11111111111')
      cpf.toString()
    }).toThrow(new BusinessException('Invalid cpf'))
  })
})
