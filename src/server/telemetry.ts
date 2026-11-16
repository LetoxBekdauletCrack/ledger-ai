import { trace, context, SpanStatusCode, Tracer } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import client from 'prom-client';

const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318';
const serviceName = process.env.OTEL_SERVICE_NAME || 'ledger-ai-backend';

// 1. Initialize OpenTelemetry Node SDK (traces and metrics OTLP export)
let sdk: NodeSDK | null = null;
try {
  const traceExporter = new OTLPTraceExporter({
    url: `${otlpEndpoint}/v1/traces`,
  });

  const metricReader = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `${otlpEndpoint}/v1/metrics`,
    }),
    exportIntervalMillis: 15000,
  });

  const sdkConfig: any = {
    serviceName,
    traceExporter,
    metricReader,
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  };

  sdk = new NodeSDK(sdkConfig);

  sdk.start();
  console.log(`📡 OpenTelemetry SDK initialized (Service: ${serviceName}, Endpoint: ${otlpEndpoint})`);
} catch (err: any) {
  console.warn('OpenTelemetry SDK initialization bypassed or failed:', err.message);
}

export const tracer: Tracer = trace.getTracer('ledger-ai-tracer', '1.0.0');

/**
 * Execute an async operation within an OpenTelemetry span
 */
export async function withSpan<T>(
  name: string,
  fn: (span: any) => Promise<T>,
  attributes?: Record<string, string | number | boolean>
): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    if (attributes) {
      for (const [k, v] of Object.entries(attributes)) {
        span.setAttribute(k, v);
      }
    }
    try {
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error: any) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message || 'Error occurred',
      });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}

// 2. Prometheus Client Registry & Custom Business Metrics
export const prometheusRegistry = new client.Registry();
client.collectDefaultMetrics({ register: prometheusRegistry, prefix: 'ledgerai_' });

export const transactionsCounter = new client.Counter({
  name: 'ledgerai_transactions_total',
  help: 'Total count of financial transactions logged in LedgerAI',
  labelNames: ['type', 'category'],
  registers: [prometheusRegistry],
});

export const aiSuggestionsCounter = new client.Counter({
  name: 'ledgerai_ai_suggestions_total',
  help: 'Total count of AI categorization suggestions requested',
  labelNames: ['status'],
  registers: [prometheusRegistry],
});

export const anomaliesDetectedCounter = new client.Counter({
  name: 'ledgerai_anomalies_detected_total',
  help: 'Total count of spending anomalies detected by statistical engine',
  labelNames: ['severity'],
  registers: [prometheusRegistry],
});

export const httpRequestDuration = new client.Histogram({
  name: 'ledgerai_http_request_duration_seconds',
  help: 'HTTP request duration in seconds across LedgerAI endpoints',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [prometheusRegistry],
});

export const activeUsersGauge = new client.Gauge({
  name: 'ledgerai_active_users',
  help: 'Number of active users in current session window',
  registers: [prometheusRegistry],
});

// Initialize baseline values
activeUsersGauge.set(1);
