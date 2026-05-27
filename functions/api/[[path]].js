const DEFAULT_STATE = {
  profile: {
    logo: '$ LINK-CREDIT',
    avatar: 'L',
    title: '¡Gana Dinero Conmigo!',
    bio: 'Estas son las apps y plataformas que uso para generar ingresos reales. Regístrate con mis enlaces y obtén bonos de bienvenida 🚀',
    whatsapp: '',
    bonusTotal: '$500+',
  },
  password: 'admin2026',
  links: [
    { id: 1, category: 'featured', icon: '🏦', title: 'SoFi', reward: '🎁 Hasta $425 USD', desc: 'Abre tu cuenta Checking & Savings y recibe $25. Con depósito directo de $1.000+ ganas $50 o $400 extra.', url: 'https://www.sofi.com/invite/money?gcp=bedfebbf-0d9e-49b0-94d5-8fcac7bf3b96&isAliasGcp=false', color1: '#00a6ed', color2: '#0077c2', users: 'Top' },
    { id: 2, category: 'featured', icon: '💰', title: 'OnePay Cash', reward: '🎁 $50 cashback', desc: 'Gana $50 de cashback al unirte y desbloquear Cash+ en los primeros 45 días.', url: 'https://web.onepay.com/wlink/refer-a-friend?product=one_banking&referral_code=ORHSAy_wL&referrer_campaign_id=campaign.db1edd0a-4a5b-4651-8c20-d0fb7e98fec5', color1: '#10b981', color2: '#059669', users: 'Top' },
    { id: 3, category: 'featured', icon: '🛍️', title: 'Rakuten', reward: '🎁 $50 USD', desc: 'Cashback en tus tiendas favoritas. Gana $50 cuando gastes $50.', url: 'https://www.rakuten.com/r/LUISDA496?eeid=6991100', color1: '#bf0000', color2: '#ef4444', users: 'Top' },
    { id: 14, category: 'featured', icon: '₿', title: 'Coinbase', reward: '🎁 Crypto gratis', desc: 'Regístrate en el exchange de crypto más popular de EE.UU. y gana crypto de bienvenida.', url: 'https://coinbase.com/join/W9YZFKP?src=android-link', color1: '#0052ff', color2: '#003ecb', users: 'Top' },
    { id: 15, category: 'featured', icon: '🐙', title: 'Kraken', reward: '🎁 Hasta $300 USD', desc: 'Regístrate, deposita y opera $200. Tú y tu amigo ganan hasta $300 cada uno. Código: w79jjqbw.', url: 'https://invite.kraken.com/JDNW/hg44jygd', color1: '#5741d9', color2: '#3b2fa0', users: 'Top' },
    { id: 16, category: 'featured', icon: '♊', title: 'Gemini', reward: '🎁 $50 USD en crypto', desc: 'Regístrate y opera $100 en tus primeros 30 días. Tú y tu amigo reciben $50 en la crypto que elijas.', url: 'https://exchange.gemini.com/register?referral=8gdzxmpt9&type=referral', color1: '#00dcfa', color2: '#0094a8', users: 'Top' },
    { id: 4, category: 'cards', icon: '📈', title: 'Kikoff', reward: 'Construye crédito fácil', desc: 'Genera crédito desde el precio de un café.', url: 'https://kikoff.com/refer/7RDLOUJW', color1: '#7c3aed', color2: '#8b5cf6', users: 'Verificado' },
    { id: 5, category: 'cards', icon: '💎', title: 'Amex Blue Cash', reward: 'Recompensas al aprobar', desc: 'Tarjeta American Express Blue Cash Everyday.', url: 'https://americanexpress.com/en-us/referral/blue-cash-everyday-credit-card?ref=LUISDVBhFh&XL=MIANS', color1: '#006fcf', color2: '#1e3a8a', users: 'Premium' },
    { id: 6, category: 'cards', icon: '💳', title: 'Capital One Savor', reward: 'Recompensas sin límite', desc: 'Recompensas ilimitadas en todas tus compras.', url: 'https://i.capitalone.com/JCJCMfgZf', color1: '#d22e1e', color2: '#ef4444', users: 'Popular' },
    { id: 7, category: 'cards', icon: '🎯', title: 'Capital One Match', reward: 'Pre-aprobación sin afectar', desc: 'Encuentra tu tarjeta ideal sin afectar tu puntaje.', url: 'https://i.capitalone.com/JIMv9hGdU', color1: '#004878', color2: '#0369a1', users: 'Popular' },
    { id: 8, category: 'cards', icon: '💵', title: 'Cash App', reward: '$5 USD gratis', desc: 'Envía $5+ en 14 días y recibe $5. Código 5H9BC6G.', url: 'https://cash.app/app/5H9BC6G', color1: '#00d632', color2: '#16a34a', users: 'Rápido' },
    { id: 9, category: 'cards', icon: '🌍', title: 'Wise', reward: 'Envíos sin comisiones', desc: 'Transferencias internacionales con tipo de cambio real.', url: 'https://wise.com/invite/ahpc/luisv1688', color1: '#9fe870', color2: '#65a30d', users: 'Global' },
    { id: 10, category: 'cashback', icon: '🧾', title: 'Fetch Rewards', reward: 'Bono al primer recibo', desc: 'Sube recibos y gana tarjetas de regalo.', url: 'https://referral.fetch.com/vvv3/referralqr?code=EE6VEA', color1: '#fbbf24', color2: '#f59e0b', users: '6M reseñas' },
    { id: 11, category: 'cashback', icon: '🐷', title: 'Receipt Hog', reward: 'Bono especial', desc: 'Te paga por subir recibos. Código slay6041.', url: 'https://app.receipthog.com/r/slay6041', color1: '#ec4899', color2: '#be185d', users: 'Activo' },
    { id: 12, category: 'cashback', icon: '🛒', title: 'Ibotta', reward: 'Cashback al comprar', desc: 'Cashback en tus compras. Código mfaygsm.', url: 'https://ibotta.onelink.me/iUfE/8cc13c64?friend_code=mfaygsm', color1: '#7c3aed', color2: '#5b21b6', users: 'Popular' },
    { id: 13, category: 'tech', icon: '🥽', title: 'Meta AI Glasses', reward: '$30 USD de descuento', desc: '$30 de descuento en los lentes con IA de Meta.', url: 'https://meta.com/ai-glasses/referrals/9JHATQ9GFNN46YG96YT3PRTKX/?utm_medium=growth&utm_campaign=rbm_referral&utm_source=organic', color1: '#1877f2', color2: '#0c63d4', users: 'Tech' },
  ],
  news: [
    { id: 1, icon: '💰', tag: 'NUEVO', date: '2026-04-20', title: 'Chase Sapphire ofrece 100.000 puntos de bienvenida', desc: 'La tarjeta Chase Sapphire Preferred lanzó una promo de 100.000 puntos al gastar $5.000 en 3 meses.', url: '', color: '#1e3a8a' },
    { id: 2, icon: '🏦', tag: 'BONO', date: '2026-04-15', title: 'Citi Premier: bono de $800 por referido', desc: 'Citi aumentó su bono de referido para la tarjeta Premier a $800 en efectivo.', url: '', color: '#d22e1e' },
    { id: 3, icon: '💳', tag: 'OFERTA', date: '2026-04-10', title: 'Capital One Venture X — 100K millas + $200 crédito', desc: '100.000 millas + $200 de crédito para viajes.', url: '', color: '#004878' },
    { id: 4, icon: '🎁', tag: 'TIP', date: '2026-04-05', title: 'Cómo maximizar los bonos de bienvenida', desc: 'Estrategias para cumplir con el gasto mínimo.', url: '', color: '#8b5cf6' },
  ],
};

const TOKEN_TTL = 86400;

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/?/, '');
  const corsHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store',
  };
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (!env.DATA) return json({ error: 'KV binding DATA no configurado' }, corsHeaders, 500);

  try {
    if (path === 'data' && request.method === 'GET') {
      const state = await getState(env);
      return json({ profile: state.profile, links: state.links, news: state.news }, corsHeaders);
    }
    if (path === 'login' && request.method === 'POST') {
      const body = await request.json();
      const state = await getState(env);
      if (!body.password || body.password !== state.password) return json({ error: 'invalid_password' }, corsHeaders, 401);
      const token = crypto.randomUUID();
      await env.DATA.put(`token:${token}`, '1', { expirationTtl: TOKEN_TTL });
      return json({ token, expires_in: TOKEN_TTL }, corsHeaders);
    }
    if (path === 'save' && request.method === 'POST') {
      const token = await requireAuth(request, env);
      if (!token) return json({ error: 'unauthorized' }, corsHeaders, 401);
      const body = await request.json();
      const current = await getState(env);
      const next = {
        profile: body.profile || current.profile,
        links: Array.isArray(body.links) ? body.links : current.links,
        news: Array.isArray(body.news) ? body.news : current.news,
        password: current.password,
      };
      await env.DATA.put('state', JSON.stringify(next));
      return json({ ok: true }, corsHeaders);
    }
    if (path === 'password' && request.method === 'POST') {
      const token = await requireAuth(request, env);
      if (!token) return json({ error: 'unauthorized' }, corsHeaders, 401);
      const { newPassword } = await request.json();
      if (!newPassword || newPassword.length < 4) return json({ error: 'password_too_short' }, corsHeaders, 400);
      const current = await getState(env);
      current.password = newPassword;
      await env.DATA.put('state', JSON.stringify(current));
      return json({ ok: true }, corsHeaders);
    }
    if (path === 'logout' && request.method === 'POST') {
      const auth = request.headers.get('Authorization') || '';
      const token = auth.replace(/^Bearer\s+/i, '');
      if (token) await env.DATA.delete(`token:${token}`);
      return json({ ok: true }, corsHeaders);
    }
    return json({ error: 'not_found', path }, corsHeaders, 404);
  } catch (err) {
    return json({ error: 'server_error', message: err.message }, corsHeaders, 500);
  }
}

async function getState(env) {
  const raw = await env.DATA.get('state');
  if (raw) { try { return JSON.parse(raw); } catch(e) {} }
  await env.DATA.put('state', JSON.stringify(DEFAULT_STATE));
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}
async function requireAuth(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const valid = await env.DATA.get(`token:${token}`);
  return valid ? token : null;
}
function json(data, headers, status = 200) {
  return new Response(JSON.stringify(data), { status, headers });
}
