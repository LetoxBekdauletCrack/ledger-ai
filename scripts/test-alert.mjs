/**
 * Synthetic Alert Trigger Probe
 * Simulates Grafana / Prometheus Alertmanager dispatching alert payload to /api/alerts/webhook
 */

const port = process.env.PORT || 3000;
const url = `http://localhost:${port}/api/alerts/webhook`;

const syntheticAlert = {
  receiver: "ledgerai-oncall-webhook",
  status: "firing",
  alerts: [
    {
      status: "firing",
      labels: {
        alertname: "HighLatencyP95",
        severity: "warning",
        instance: "ledger-ai-prod:3000",
        service: "ledger-ai-backend"
      },
      annotations: {
        summary: "P95 API Latency Exceeded 1.0s SLA Threshold",
        description: "95th percentile request latency reached 1.24s on /api/analytics/summary over the last 5 minutes."
      },
      value: "1.24s",
      startsAt: new Date().toISOString()
    }
  ]
};

console.log(`📡 Dispatching synthetic alert to ${url}...`);

try {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(syntheticAlert),
  });

  if (!res.ok) {
    throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  console.log('✅ Synthetic alert successfully delivered to webhook!');
  console.log('Triage response:', JSON.stringify(data, null, 2));
} catch (err) {
  console.error('Failed to trigger alert:', err.message);
}
