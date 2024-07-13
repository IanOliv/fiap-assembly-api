import BusinessException from '@/core/domain/errors/business-exception'
import Email from '@/core/domain/value-object/email'

describe('Test of Email Value-Object class', () => {
  it('Test constructor class with validate as true using valid email', () => {
    const email = new Email('test@test.com')
    expect(email).toBeInstanceOf(Email)
  })

  it('Test constructor class with validate as true using invalid email', () => {
    expect(() => {
      const email = new Email('test1test.com')
      email.toString()
    }).toThrow(new BusinessException('Invalid Email'))
  })

  it('Test constructor class with validate as false', () => {
    const email = new Email('test@test.com', false)
    expect(email).toBeInstanceOf(Email)
  })

  it('Test toString method', () => {
    const email = new Email('test@test.com')
    expect(email.toString()).toEqual('test@test.com')
  })
})
