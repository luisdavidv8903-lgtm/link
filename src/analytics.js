export const analyticsConfig = {
  enabled: import.meta.env.VITE_ANALYTICS_ENABLED !== 'false',
  ga4MeasurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID || '',
  clarityProjectId: import.meta.env.VITE_CLARITY_PROJECT_ID || '',
}

let initialized = false
let scrollCleanup = null

function canUseBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function appendScript(src, id) {
  if (!canUseBrowser() || document.getElementById(id)) return
  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

function initGA4() {
  if (!analyticsConfig.ga4MeasurementId) return

  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments) }
  appendScript(`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.ga4MeasurementId}`, 'ga4-script')
  window.gtag('js', new Date())
  window.gtag('config', analyticsConfig.ga4MeasurementId, {
    page_path: window.location.pathname,
  })
}

function initClarity() {
  if (!analyticsConfig.clarityProjectId || window.clarity) return

  window.clarity = function clarity() {
    window.clarity.q.push(arguments)
  }
  window.clarity.q = []
  appendScript(`https://www.clarity.ms/tag/${analyticsConfig.clarityProjectId}`, 'clarity-script')
}

export function initAnalytics() {
  if (!canUseBrowser() || initialized || !analyticsConfig.enabled) return
  initialized = true
  initGA4()
  initClarity()
}

export function trackEvent(name, params = {}) {
  if (!canUseBrowser() || !analyticsConfig.enabled) return

  const payload = {
    page_path: window.location.pathname,
    ...params,
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload)
  }

  if (typeof window.clarity === 'function') {
    window.clarity('event', name)
  }
}

export function trackCtaClick(label, location) {
  trackEvent('cta_click', { cta_label: label, cta_location: location })
}

export function trackFormStarted(formName) {
  trackEvent('form_started', { form_name: formName })
}

export function trackFormCompleted(formName) {
  trackEvent('form_completed', { form_name: formName })
}

export function trackWhatsAppClick(location) {
  trackEvent('whatsapp_click', { cta_location: location })
}

export function trackCallClick(location) {
  trackEvent('call_button_click', { cta_location: location })
}

export function setupScrollDepthTracking(depths = [25, 50, 75, 90]) {
  if (!canUseBrowser() || !analyticsConfig.enabled) return () => {}
  if (scrollCleanup) scrollCleanup()

  const tracked = new Set()
  const onScroll = () => {
    const doc = document.documentElement
    const scrollable = doc.scrollHeight - window.innerHeight
    if (scrollable <= 0) return

    const depth = Math.round((window.scrollY / scrollable) * 100)
    depths.forEach(target => {
      if (depth >= target && !tracked.has(target)) {
        tracked.add(target)
        trackEvent('scroll_depth', { percent_scrolled: target })
      }
    })
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  scrollCleanup = () => window.removeEventListener('scroll', onScroll)
  return scrollCleanup
}
