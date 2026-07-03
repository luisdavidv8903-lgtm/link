/**
 * DELIVERYLINK LLC — Chat API Worker
 * Standalone Cloudflare Worker that proxies chat requests to Anthropic Claude.
 *
 * Required secret (set via `wrangler secret put ANTHROPIC_API_KEY`):
 *   ANTHROPIC_API_KEY
 *
 * Optional var (in wrangler.toml [vars] or dashboard):
 *   ALLOWED_ORIGIN — restrict CORS to a specific origin (defaults to '*')
 */

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, anthropic-version',
  }
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(env)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    if (request.method !== 'POST') {
      return Response.json({ error: { message: 'Method not allowed.' } }, { status: 405, headers: cors })
    }

    if (!env.ANTHROPIC_API_KEY) {
      return Response.json({ error: { message: 'Server not configured.' } }, { status: 500, headers: cors })
    }

    let body
    try {
      body = await request.text()
      JSON.parse(body)
    } catch {
      return Response.json({ error: { message: 'Invalid JSON body.' } }, { status: 400, headers: cors })
    }

    let anthropicRes
    try {
      anthropicRes = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': ANTHROPIC_VERSION,
          'content-type': 'application/json',
        },
        body,
      })
    } catch {
      return Response.json({ error: { message: 'Upstream request failed.' } }, { status: 502, headers: cors })
    }

    const data = await anthropicRes.text()
    return new Response(data, {
      status: anthropicRes.status,
      headers: { ...cors, 'content-type': 'application/json' },
    })
  },
}
