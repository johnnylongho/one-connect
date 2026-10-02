export interface AutomationEventPayload {
  eventType: 'ATTENDEE_CHECKED_IN' | 'B2B_CONNECTION_REQUESTED' | 'B2B_CONNECTION_ACCEPTED' | 'LEAD_CREATED' | 'NFC_CARD_TAPPED';
  timestamp: string;
  data: Record<string, any>;
  metadata: {
    source: 'ONE_CONNECT_PLATFORM';
    version: '1.0.0';
    environment: 'production' | 'staging' | 'demo';
  };
}

export interface WebhookLogItem {
  id: string;
  eventType: string;
  timestamp: string;
  targetUrl: string;
  status: 'DELIVERED' | 'SIMULATED' | 'FAILED';
  statusCode: number;
  payload: AutomationEventPayload;
}

// In-memory / client-accessible event dispatch buffer for demo & simulation
let webhookHistory: WebhookLogItem[] = [];

export async function dispatchAutomationWebhook(
  eventType: AutomationEventPayload['eventType'],
  data: Record<string, any>
): Promise<WebhookLogItem> {
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';
  const openClawEndpoint = process.env.OPENCLAW_API_URL || process.env.NEXT_PUBLIC_OPENCLAW_API_URL || '';

  const payload: AutomationEventPayload = {
    eventType,
    timestamp: new Date().toISOString(),
    data,
    metadata: {
      source: 'ONE_CONNECT_PLATFORM',
      version: '1.0.0',
      environment: n8nWebhookUrl ? 'production' : 'demo',
    },
  };

  const logId = `wh-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  let status: WebhookLogItem['status'] = 'SIMULATED';
  let statusCode = 200;

  // Real HTTP dispatch if n8n webhook URL is configured
  if (n8nWebhookUrl) {
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OneConnect-Event': eventType,
        },
        body: JSON.stringify(payload),
      });
      statusCode = response.status;
      status = response.ok ? 'DELIVERED' : 'FAILED';
    } catch (err) {
      console.warn('n8n Webhook dispatch error:', err);
      status = 'FAILED';
      statusCode = 500;
    }
  }

  const logItem: WebhookLogItem = {
    id: logId,
    eventType,
    timestamp: payload.timestamp,
    targetUrl: n8nWebhookUrl || 'https://n8n.aplusvn.com/webhook/one-connect-events (Simulated)',
    status,
    statusCode,
    payload,
  };

  webhookHistory.unshift(logItem);
  if (webhookHistory.length > 50) webhookHistory.pop();

  return logItem;
}

export function getRecentWebhookLogs(): WebhookLogItem[] {
  return webhookHistory;
}
