/**
 * DELIVERYLINK LLC - Admin lead dashboard API
 * Cloudflare Pages Function: /api/admin-leads
 *
 * Required production secrets:
 * - ADMIN_TOKEN
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
}

async function querySupabase(env, table, columns) {
  const url = `${env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${table}?select=${columns}&order=created_at.desc`
  const res = await fetch(url, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(detail || `Failed to load ${table}.`)
  }

  return res.json()
}

export async function onRequestGet(context) {
  const { request, env } = context
  const token = request.headers.get('x-admin-token')

  if (!env.ADMIN_TOKEN || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ error: { message: 'Admin API is not configured.' } }, { status: 500, headers: CORS_HEADERS })
  }

  if (!token || token !== env.ADMIN_TOKEN) {
    return Response.json({ error: { message: 'Unauthorized.' } }, { status: 401, headers: CORS_HEADERS })
  }

  try {
    const [governmentLeads, strategyCalls] = await Promise.all([
      querySupabase(env, 'government_leads', 'id,created_at,owner_name,business_name,email,phone,state,industry,llc,ein,uei,sam,capability_statement,government_experience,score'),
      querySupabase(env, 'strategy_calls', 'id,created_at,name,company,email,phone'),
    ])

    return Response.json({
      government_leads: governmentLeads,
      strategy_calls: strategyCalls,
    }, { headers: CORS_HEADERS })
  } catch (err) {
    return Response.json({ error: { message: err.message } }, { status: 502, headers: CORS_HEADERS })
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}
