import { Event, EventHint } from '@sentry/node'
import * as Sentry from '@sentry/node'
import { NodeOptions } from '@sentry/node/types/types'
import { ProfilingIntegration } from '@sentry/profiling-node'

import { Environment as envs } from '@/infra/web/nestjs/environment'

const envAllowList = ['production', 'homolog']

interface SentryConfig extends NodeOptions {}

export default {
  dsn: envs.SENTRY_DSN,
  environment: envs.NODE_ENV,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new ProfilingIntegration(),
  ],
  beforeSend: (event: Event, _hint: EventHint): PromiseLike<Event | null> | Event | null => {
    const sendEvent = (envAllowList.indexOf(envs.NODE_ENV) !== -1)

    if (!sendEvent) {
      console.error('Sentry event not sent')
      console.error(event.exception?.values?.[0] || event.message || event)
    }

    return sendEvent ? event : null
  },
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
} as SentryConfig
