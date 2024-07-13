import { Cache } from 'cache-manager'

import AppCache from '@/core/helpers/AppCache'

describe('Test for AppCache Class', () => {
  let appCache: AppCache
  let cache: jest.Mocked<Cache>

  beforeEach(() => {
    cache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      reset: jest.fn()
    } as unknown as jest.Mocked<Cache>

    appCache = new AppCache(cache)
  })

  it('test constructor', () => {
    expect(appCache).toBeInstanceOf(AppCache)
  })

  it('test set method with env configured', async () => {
    process.env.REDIS_ENABLED = 'true'
    process.env.CACHE_ENABLED = 'true'
    await appCache.set('k', 'v')
    expect(cache.set).toHaveBeenCalled()
  })

  it('test set method without env configured', async () => {
    delete process.env.REDIS_ENABLED
    await appCache.set('k', 'v')
    expect(cache.set).toHaveBeenCalledTimes(0)
  })

  it('test get method with env configured', async () => {
    process.env.REDIS_ENABLED = 'true'
    process.env.CACHE_ENABLED = 'true'
    await appCache.get('k')
    expect(cache.get).toHaveBeenCalled()
  })

  it('test get method without env configured', async () => {
    delete process.env.REDIS_ENABLED
    await appCache.get('k')
    expect(cache.get).toHaveBeenCalledTimes(0)
  })

  it('test del method with env configured', async () => {
    process.env.REDIS_ENABLED = 'true'
    process.env.CACHE_ENABLED = 'true'
    await appCache.del('k')
    expect(cache.del).toHaveBeenCalled()
  })

  it('test del method without env configured', async () => {
    delete process.env.REDIS_ENABLED
    await appCache.del('k')
    expect(cache.del).toHaveBeenCalledTimes(0)
  })

  it('test reset method with env configured', async () => {
    process.env.REDIS_ENABLED = 'true'
    process.env.CACHE_ENABLED = 'true'
    await appCache.reset()
    expect(cache.reset).toHaveBeenCalled()
  })

  it('test reset method without env configured', async () => {
    delete process.env.REDIS_ENABLED
    await appCache.reset()
    expect(cache.reset).toHaveBeenCalledTimes(0)
  })
})
