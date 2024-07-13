import BusinessException from '@/core/domain/errors/business-exception'

describe('Testing BusinessException Error Class', () => {
  it('Testing class constructor', () => {
    const error = new BusinessException('error message')
    expect(error).toBeInstanceOf(BusinessException)
    expect(error.name).toEqual('BusinessException')
  })

  it('Testing getMessages method', () => {
    const error = new BusinessException('error message')
    expect(error.getMessages()).toContain('error message')
  })
})
