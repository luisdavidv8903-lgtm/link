/**
 * DELIVERYLINK LLC - Chat API Proxy
 * Cloudflare Pages Function: /api/chat
 * Variable requerida: ANTHROPIC_API_KEY (Secret en Cloudflare)
 *
 * NOTE: This code is correct — env.ANTHROPIC_API_KEY not arriving is a
 * Pages dashboard configuration issue, not a code bug. Common causes:
 *   1. Secret set under "Preview" only, not "Production" (or vice versa) —
 *      Pages requires it set per-environment under
 *      Settings → Environment variables.
 *   2. Secret added AFTER the active deployment was built — Pages bakes
 *      env bindings into each deployment; trigger a new deployment
 *      ("Retry deployment" or push a commit) after adding/changing it.
 *   3. Custom domain pointing at a Preview deployment instead of
 *      Production, which has its own separate variable set.
 *
 * Superseded by worker/chat-worker.js, which uses a Worker Route + plain
 * `wrangler secret put` — avoids the Pages Production/Preview split above.
 * Kept here as a fallback if the dashboard config above is fixed instead.
 */
export async function onRequestPost(context) {
  const { request, env } = context
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, anthropic-version',
  }
  if (!env.ANTHROPIC_API_KEY) {
    return Response.json({ error: { message: 'Server not configured.' } }, { status: 500, headers: cors })
  }
  const body = await request.text()
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: body,
  })
  const data = await res.text()
  return new Response(data, { status: res.status, headers: { ...cors, 'content-type': 'application/json' } })
}
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, anthropic-version' } })
}
