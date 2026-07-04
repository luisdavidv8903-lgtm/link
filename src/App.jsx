import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Menu, X, ChevronRight, Mail, Phone, MapPin, Shield, Code, Globe, Bot,
  FileText, Users, Award, Building2, Briefcase, ArrowRight, ExternalLink,
  MessageCircle, Send, Printer, Download, Star, CheckCircle, Clock, DollarSign
} from 'lucide-react'
import BlogLayout from './BlogLayout'
import { SEO_PAGES } from './seoContent'

// ─── Company Data / Datos de la empresa ───
const COMPANY = {
  name: 'DELIVERYLINK LLC',
  owner: 'Luis David Vergara',
  location: 'Loxahatchee, FL 33470',
  phone: '(561) 679-0314',
  email: 'ldvh@deliverylinktech.com',
  website: 'deliverylinktech.com',
  uei: 'JK4YVQB7DZ24',
  cage: '21GG9',
  naics: ['541511', '541512', '541513', '541519', '541619'],
}

const PRIMARY_OFFER = 'FREE Government Contract Readiness Review'
const PRIMARY_CTA = 'Get My Free Review'
const WHATSAPP_URL = 'https://wa.me/15616790314?text=I%20want%20my%20free%20Government%20Contract%20Readiness%20Review.'

const SERVICES = [
  {
    icon: Code, title: 'Custom Software Development', rate: '$95–$145/hr',
    desc: 'Full-stack applications, APIs, microservices, and cloud-native solutions tailored to your business requirements.',
  },
  {
    icon: Bot, title: 'AI / LLM Integration', rate: '$125–$165/hr',
    desc: 'Claude API integrations, intelligent automation, NLP pipelines, and AI-powered decision support systems.',
  },
  {
    icon: Globe, title: 'Web Development & Modernization', rate: '$95/hr',
    desc: 'React, Next.js, and modern web platforms. Legacy system modernization with Section 508 compliance.',
  },
  {
    icon: Shield, title: 'IT Consulting', rate: '$95–$125/hr',
    desc: 'Cloud architecture, cybersecurity assessments, infrastructure planning, and digital transformation strategy.',
  },
  {
    icon: Building2, title: 'Government Procurement Consulting', rate: '$95/hr',
    desc: 'SAM.gov registration, proposal writing, compliance support, and federal marketplace strategy.',
  },
  {
    icon: FileText, title: 'Technical Documentation', rate: '$95/hr',
    desc: 'API documentation, system architecture diagrams, SOPs, and compliance documentation.',
  },
]

const PROJECTS = [
  {
    title: 'FinAdvisor Pro',
    desc: 'Gives financial advisors instant, AI-assisted client guidance while meeting bank-grade security requirements — Claude API analysis, TLS 1.3 encryption, and role-based access control, deployed on Azure.',
    tags: ['Claude API', 'React', 'Azure', 'RBAC', 'TLS 1.3'],
  },
  {
    title: 'Link Credit Platform',
    desc: 'Lets referral partners track verified leads and calculate earnings in real time, in a bilingual interface, without manual reconciliation.',
    tags: ['React', 'Cloudflare', 'Bilingual', 'FinTech'],
  },
]

const READINESS_ITEMS = [
  { icon: Shield, title: 'SAM Registration' },
  { icon: Award, title: 'UEI Status' },
  { icon: FileText, title: 'Capability Statement' },
  { icon: Briefcase, title: 'NAICS Validation' },
  { icon: CheckCircle, title: 'Certifications' },
  { icon: Globe, title: 'Opportunity Match' },
]

const SOCIAL_PROOF = [
  { icon: Bot, title: 'AI-Powered Decision Support' },
  { icon: Building2, title: 'Government Contract Intelligence' },
  { icon: Shield, title: 'Federal Readiness Assessment' },
  { icon: Star, title: 'Opportunity Analysis' },
]

const FEATURED_PRODUCT = {
  name: 'GovPilot AI',
  desc: 'AI-powered intelligence platform designed to help businesses evaluate, prepare and compete for U.S. Government contracts.',
}

const CERTIFICATIONS = [
  { label: 'Active SAM.gov Registration', detail: `UEI: ${COMPANY.uei}` },
  { label: 'CAGE Code', detail: COMPANY.cage },
  { label: 'Hispanic American-Owned Small Business', detail: 'MFMP Certified' },
  { label: 'Google IT Support Professional', detail: 'Certificate' },
]

// ─── Claude API Chat / Chat con Claude API ───
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const CHAT_MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 1000
// Defaults to the same-origin Pages Function/Worker route. Override at build
// time with VITE_CHAT_API_URL if the Worker is deployed to a workers.dev URL.
const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || '/api/chat'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const ASSESSMENT_INITIAL = {
  business_name: '',
  owner_name: '',
  email: '',
  phone: '',
  state: '',
  industry: '',
  llc: '',
  ein: '',
  uei: '',
  sam: '',
  capability_statement: '',
  government_experience: '',
}

const STRATEGY_CALL_INITIAL = {
  name: '',
  company: '',
  email: '',
  phone: '',
}

const ASSESSMENT_STEPS = [
  { title: 'Business Profile', fields: ['business_name', 'owner_name'] },
  { title: 'Contact Details', fields: ['email', 'phone', 'state'] },
  { title: 'Company Setup', fields: ['industry', 'llc', 'ein'] },
  { title: 'Federal Readiness', fields: ['uei', 'sam', 'capability_statement'] },
  { title: 'Experience', fields: ['government_experience'] },
]

const FIELD_LABELS = {
  name: 'Name',
  company: 'Company',
  business_name: 'Business Name',
  owner_name: 'Owner Name',
  email: 'Email',
  phone: 'Phone',
  state: 'State',
  industry: 'Industry',
  llc: 'Do you have an LLC?',
  ein: 'Do you have an EIN?',
  uei: 'Do you have a UEI?',
  sam: 'Are you registered in SAM.gov?',
  capability_statement: 'Do you have a Capability Statement?',
  government_experience: 'Have you ever won a government contract?',
}

const BOOLEAN_FIELDS = ['llc', 'ein', 'uei', 'sam', 'capability_statement', 'government_experience']

function boolFromAnswer(value) {
  return value === 'yes'
}

function calculateReadinessScore(values) {
  const weights = {
    llc: 15,
    ein: 15,
    uei: 20,
    sam: 20,
    capability_statement: 15,
    government_experience: 15,
  }

  return Object.entries(weights).reduce((score, [field, weight]) => (
    score + (boolFromAnswer(values[field]) ? weight : 0)
  ), 0)
}

function getRecommendations(values) {
  const recommendations = [
    !boolFromAnswer(values.llc) && 'Form or confirm your LLC so your business is ready for vendor registration.',
    !boolFromAnswer(values.ein) && 'Get an EIN from the IRS before starting federal vendor setup.',
    !boolFromAnswer(values.uei) && 'Request a UEI so your business can be identified in federal systems.',
    !boolFromAnswer(values.sam) && 'Complete SAM.gov registration to become eligible for federal awards.',
    !boolFromAnswer(values.capability_statement) && 'Create a concise capability statement tailored to federal buyers.',
    !boolFromAnswer(values.government_experience) && 'Start with smaller opportunities, subcontracting, or set-aside research to build past performance.',
  ].filter(Boolean)

  const nextSteps = [
    'Validate your NAICS codes against real federal opportunities.',
    'Build an opportunity watchlist for agencies buying in your industry.',
    'Prepare a short outreach plan for contracting officers and prime contractors.',
    'Review certifications that may improve your competitive position.',
    'Request your free Government Contract Readiness Review to prioritize your fastest path to market.',
  ]

  return [...recommendations, ...nextSteps].slice(0, 5)
}

async function submitGovernmentLead(values, score) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }

  const payload = {
    business_name: values.business_name.trim(),
    owner_name: values.owner_name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    state: values.state.trim(),
    industry: values.industry.trim(),
    llc: boolFromAnswer(values.llc),
    ein: boolFromAnswer(values.ein),
    uei: boolFromAnswer(values.uei),
    sam: boolFromAnswer(values.sam),
    capability_statement: boolFromAnswer(values.capability_statement),
    government_experience: boolFromAnswer(values.government_experience),
    score,
  }

  const res = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/government_leads`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(detail || `Supabase submission failed with status ${res.status}.`)
  }
}

async function submitStrategyCall(values) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }

  const payload = {
    name: values.name.trim(),
    company: values.company.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
  }

  const res = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/strategy_calls`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(detail || `Supabase submission failed with status ${res.status}.`)
  }
}

async function fetchAdminLeads(token) {
  const res = await fetch('/api/admin-leads', {
    headers: { 'x-admin-token': token },
  })

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error(detail.error?.message || `Admin request failed with status ${res.status}.`)
  }

  return res.json()
}

const SYSTEM_PROMPT = `You are the virtual assistant for DELIVERYLINK LLC, a Florida-based AI platform for government contracting readiness and opportunity intelligence. Respond in English by default. Switch to Spanish immediately if the user writes in Spanish or requests it.

COMPANY INFO:
- Owner: Luis David Vergara
- Location: Loxahatchee, FL 33470
- Phone: (561) 679-0314
- Email: ldvh@deliverylinktech.com
- Website: deliverylinktech.com
- SAM.gov UEI: JK4YVQB7DZ24 | CAGE: 21GG9
- Business: Small Business, Hispanic American-Owned, AI platform for U.S. Government contracting
- NAICS: 541511, 541512, 541513, 541519, 541619

SERVICES & RATES:
- IT Consulting: $95-$125/hr
- Custom Software Development: $95-$145/hr
- Web Development & Modernization: $95/hr
- AI/LLM Integration: $125-$165/hr
- Government Procurement Consulting: $95/hr

PAST PERFORMANCE:
- FinAdvisor Pro: AI financial platform (Claude API, TLS 1.3, RBAC, cloud deployment)
- GovPilot AI: AI-powered readiness assessment and government contract opportunity intelligence

YOUR 4 TASKS:
1. Help businesses understand government contracting readiness
2. Collect leads: name, company, email, phone, project description — show summary when complete
3. Explain GovPilot AI, services, and general pricing guidance
4. Schedule callback requests with preferred date/time

CERTIFICATIONS (only claim these):
- Active SAM.gov registration (UEI: JK4YVQB7DZ24)
- CAGE Code: 21GG9
- Hispanic American-Owned Small Business (MFMP)
- Google IT Support Professional Certificate
- DO NOT claim SDB certification`

const WELCOME_MSG = `Hi! I'm the DELIVERYLINK LLC virtual assistant. I can help you start a government readiness assessment, learn about GovPilot AI, or schedule a callback with Luis.\n\nHow can I help you today?\n\n_(Para español, escribe 'español')_`

// ─── Reusable Components / Componentes reutilizables ───

function NavLink({ href, children, onClick }) {
  return (
    <a href={href} onClick={onClick}
      className="text-slate-600 hover:text-brand-dark font-medium transition-colors">
      {children}
    </a>
  )
}

function SectionTitle({ badge, title, subtitle }) {
  return (
    <div className="text-center mb-12">
      {badge && (
        <span className="inline-block px-4 py-1.5 bg-blue-50 text-brand-dark text-sm font-semibold rounded-full mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{title}</h2>
      {subtitle && <p className="text-slate-500 max-w-2xl mx-auto text-lg">{subtitle}</p>}
    </div>
  )
}

function IconCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-brand/20 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-brand-dark flex items-center justify-center mb-4 transition-colors">
        <Icon size={24} className="text-brand-dark group-hover:text-white transition-colors" />
      </div>
      <h3 className="font-bold text-lg text-slate-800 mb-1">{title}</h3>
      {desc && <div className="text-slate-500 text-sm leading-relaxed">{desc}</div>}
    </div>
  )
}

function TextInput({ id, value, onChange, type = 'text', placeholder }) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-sm font-semibold text-slate-700 mb-2">{FIELD_LABELS[id]}</span>
      <input id={id} type={type} value={value} required placeholder={placeholder}
        onChange={e => onChange(id, e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-brand focus:ring-4 focus:ring-blue-50"
      />
    </label>
  )
}

function YesNoField({ id, value, onChange }) {
  return (
    <fieldset>
      <legend className="block text-sm font-semibold text-slate-700 mb-3">{FIELD_LABELS[id]}</legend>
      <div className="grid grid-cols-2 gap-3">
        {['yes', 'no'].map(option => (
          <button key={option} type="button" onClick={() => onChange(id, option)}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              value === option
                ? 'border-brand-dark bg-brand-dark text-white shadow-lg shadow-brand-dark/15'
                : 'border-slate-200 bg-white text-slate-600 hover:border-brand'
            }`}>
            {option === 'yes' ? 'Yes' : 'No'}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function StrategyReviewForm() {
  const [values, setValues] = useState(STRATEGY_CALL_INITIAL)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const updateValue = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const submitReview = async (event) => {
    event.preventDefault()
    const complete = Object.values(values).every(value => value.trim())
    if (!complete) {
      setError('Complete every field to request your review.')
      return
    }

    setStatus('submitting')
    setError('')

    try {
      await submitStrategyCall(values)
      setStatus('submitted')
    } catch (err) {
      setStatus('idle')
      setError(err.message)
    }
  }

  if (status === 'submitted') {
    return (
      <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-5 text-green-800">
        <div className="font-bold mb-1">Thank you.</div>
        <p className="text-sm leading-relaxed">
          A Government Contract Advisor from DeliveryLink will contact you within one business day.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submitReview} className="mt-6 rounded-2xl border border-slate-100 bg-white p-5">
      <h4 className="font-bold text-slate-900 mb-1">Request Your Free Government Readiness Review</h4>
      <p className="text-sm text-slate-500 mb-5">Share your contact details and we will follow up with next steps.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextInput id="name" value={values.name} onChange={updateValue} />
        <TextInput id="company" value={values.company} onChange={updateValue} />
        <TextInput id="email" type="email" value={values.email} onChange={updateValue} />
        <TextInput id="phone" type="tel" value={values.phone} onChange={updateValue} />
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <button type="submit" disabled={status === 'submitting'}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-brand-dark hover:bg-brand text-white font-semibold px-6 py-3 rounded-xl transition text-base shadow-lg shadow-brand-dark/20 disabled:opacity-60">
        {status === 'submitting' ? 'Sending...' : 'Request Your Free Government Readiness Review'} <ArrowRight size={18} />
      </button>
    </form>
  )
}

function ReadinessAssessment() {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState(ASSESSMENT_INITIAL)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const activeStep = ASSESSMENT_STEPS[step]
  const progress = Math.round(((step + 1) / ASSESSMENT_STEPS.length) * 100)

  const updateValue = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const stepIsValid = activeStep.fields.every(field => values[field].trim())
  const nextStep = () => {
    if (!stepIsValid) {
      setError('Complete every field in this step before continuing.')
      return
    }
    setStep(prev => Math.min(prev + 1, ASSESSMENT_STEPS.length - 1))
  }

  const submitAssessment = async (event) => {
    event.preventDefault()
    if (!stepIsValid) {
      setError('Complete every field in this step before submitting.')
      return
    }

    const score = calculateReadinessScore(values)
    setStatus('submitting')
    setError('')

    try {
      await submitGovernmentLead(values, score)
      setResult({ score, recommendations: getRecommendations(values) })
      setStatus('submitted')
    } catch (err) {
      setStatus('idle')
      setError(err.message)
    }
  }

  if (result) {
    return (
      <div id="assessment-form" className="mt-12 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200 p-6 md:p-8">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start">
          <div>
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-brand-dark text-sm font-semibold rounded-full mb-4">
              Government Readiness Score
            </span>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">Your score:</h3>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-6xl font-extrabold text-brand-dark">{result.score}</span>
              <span className="text-2xl font-bold text-slate-400 mb-2">/100</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Your submission was saved. Use these recommendations to prioritize the fastest path toward federal readiness.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" /> Top 5 recommendations
            </h4>
            <ol className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                  <span className="w-6 h-6 rounded-lg bg-blue-50 text-brand-dark font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ol>
            <StrategyReviewForm />
          </div>
        </div>
      </div>
    )
  }

  return (
    <form id="assessment-form" onSubmit={submitAssessment}
      className="mt-12 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold text-brand-dark mb-1">Step {step + 1} of {ASSESSMENT_STEPS.length}</p>
          <h3 className="text-2xl font-bold text-slate-900">{activeStep.title}</h3>
        </div>
        <div className="md:w-72">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 rounded-full bg-white border border-slate-200 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-dark to-brand transition-all duration-300"
              style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {activeStep.fields.map(field => (
          BOOLEAN_FIELDS.includes(field) ? (
            <YesNoField key={field} id={field} value={values[field]} onChange={updateValue} />
          ) : (
            <TextInput key={field} id={field} value={values[field]} onChange={updateValue}
              type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              placeholder={field === 'state' ? 'FL' : field === 'industry' ? 'Construction, IT, cleaning, logistics...' : ''}
            />
          )
        ))}
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap justify-between gap-4 mt-8">
        <button type="button" onClick={() => setStep(prev => Math.max(prev - 1, 0))} disabled={step === 0 || status === 'submitting'}
          className="inline-flex items-center gap-2 border-2 border-slate-200 hover:border-brand text-slate-700 font-semibold px-6 py-3 rounded-xl transition text-base disabled:opacity-40 disabled:pointer-events-none">
          Back
        </button>

        {step < ASSESSMENT_STEPS.length - 1 ? (
          <button type="button" onClick={nextStep}
            className="inline-flex items-center gap-2 bg-brand-dark hover:bg-brand text-white font-semibold px-6 py-3 rounded-xl transition text-base shadow-lg shadow-brand-dark/20">
            Continue <ArrowRight size={18} />
          </button>
        ) : (
          <button type="submit" disabled={status === 'submitting'}
            className="inline-flex items-center gap-2 bg-brand-dark hover:bg-brand text-white font-semibold px-6 py-3 rounded-xl transition text-base shadow-lg shadow-brand-dark/20 disabled:opacity-60">
            {status === 'submitting' ? 'Saving...' : 'Get My Score'} <ArrowRight size={18} />
          </button>
        )}
      </div>
    </form>
  )
}

function AdminField({ label, value }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase text-slate-400">{label}</div>
      <div className="text-sm text-slate-700 break-words">{value || '-'}</div>
    </div>
  )
}

function AdminPage() {
  const [token, setToken] = useState('')
  const [data, setData] = useState({ government_leads: [], strategy_calls: [] })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const loadAdminData = async (event) => {
    event.preventDefault()
    if (!token.trim()) {
      setError('Enter the admin token.')
      return
    }

    setStatus('loading')
    setError('')

    try {
      const result = await fetchAdminLeads(token.trim())
      setData(result)
      setStatus('loaded')
    } catch (err) {
      setStatus('idle')
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center">
              <Code size={20} className="text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-lg text-slate-800">DELIVERYLINK Admin</span>
          </a>
          <a href="/" className="text-sm font-semibold text-brand-dark hover:text-brand transition">Back to site</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-10">
        <SectionTitle badge="Admin" title="Lead Dashboard"
          subtitle="Government Readiness leads and Strategy Call requests, newest first." />

        {status !== 'loaded' && (
          <form onSubmit={loadAdminData} className="max-w-md mx-auto bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <label htmlFor="admin-token" className="block text-sm font-semibold text-slate-700 mb-2">Admin token</label>
            <input id="admin-token" type="password" value={token} onChange={e => setToken(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-brand focus:ring-4 focus:ring-blue-50"
            />
            {error && <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
            <button type="submit" disabled={status === 'loading'}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-brand-dark hover:bg-brand text-white font-semibold px-6 py-3 rounded-xl transition text-base shadow-lg shadow-brand-dark/20 disabled:opacity-60">
              {status === 'loading' ? 'Loading...' : 'View Leads'}
            </button>
          </form>
        )}

        {status === 'loaded' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Government Readiness leads</h2>
              <div className="space-y-4">
                {data.government_leads.length === 0 && <p className="text-slate-500 bg-white rounded-2xl border border-slate-100 p-6">No readiness leads yet.</p>}
                {data.government_leads.map(lead => (
                  <article key={lead.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900">{lead.business_name}</h3>
                        <p className="text-sm text-slate-500">{new Date(lead.created_at).toLocaleString()}</p>
                      </div>
                      <div className="rounded-xl bg-blue-50 px-3 py-2 text-brand-dark font-bold">{lead.score}/100</div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <AdminField label="Owner" value={lead.owner_name} />
                      <AdminField label="Email" value={lead.email} />
                      <AdminField label="Phone" value={lead.phone} />
                      <AdminField label="State" value={lead.state} />
                      <AdminField label="Industry" value={lead.industry} />
                      <AdminField label="SAM" value={lead.sam ? 'Yes' : 'No'} />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Strategy Call requests</h2>
              <div className="space-y-4">
                {data.strategy_calls.length === 0 && <p className="text-slate-500 bg-white rounded-2xl border border-slate-100 p-6">No strategy call requests yet.</p>}
                {data.strategy_calls.map(request => (
                  <article key={request.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-1">{request.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">{new Date(request.created_at).toLocaleString()}</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <AdminField label="Company" value={request.company} />
                      <AdminField label="Email" value={request.email} />
                      <AdminField label="Phone" value={request.phone} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

function FloatingConversionButtons() {
  const phoneHref = `tel:${COMPANY.phone.replace(/[^\d+]/g, '')}`

  return (
    <div className="no-print">
      <div className="fixed left-4 bottom-24 md:bottom-5 z-[9997] flex flex-col gap-3">
        <a href={WHATSAPP_URL} aria-label="Message DeliveryLink on WhatsApp"
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg flex items-center justify-center transition">
          <MessageCircle size={24} className="text-white" />
        </a>
        <a href={phoneHref} aria-label="Call DeliveryLink"
          className="w-14 h-14 rounded-full bg-brand-dark hover:bg-brand shadow-lg flex items-center justify-center transition">
          <Phone size={24} className="text-white" />
        </a>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[9996] md:hidden bg-white border-t border-slate-200 p-3 shadow-2xl">
        <a href="#assessment-form"
          className="inline-flex w-full items-center justify-center gap-2 bg-brand-dark hover:bg-brand text-white font-semibold px-5 py-3.5 rounded-xl transition shadow-lg shadow-brand-dark/20">
          {PRIMARY_CTA} <ArrowRight size={18} />
        </a>
      </div>
    </div>
  )
}

// ─── Chat Widget Component / Componente del Chat ───
function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [leads, setLeads] = useState([])
  const [showLeads, setShowLeads] = useState(false)
  const [pulse, setPulse] = useState(true)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    try { setLeads(JSON.parse(localStorage.getItem('deliverylink_leads') || '[]')) } catch {}
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: WELCOME_MSG }])
    }
    if (open) {
      setPulse(false)
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [open])

  const saveLead = useCallback((leadData) => {
    const entry = { ...leadData, timestamp: new Date().toLocaleString() }
    const updated = [...leads, entry]
    setLeads(updated)
    localStorage.setItem('deliverylink_leads', JSON.stringify(updated))
  }, [leads])

  const extractLead = useCallback((text) => {
    const patterns = {
      Name: /(?:name|nombre)[:\s]+([^\n,]+)/i,
      Company: /(?:company|empresa|organization)[:\s]+([^\n,]+)/i,
      Email: /(?:email|correo)[:\s]+([\w.+-]+@[\w.-]+)/i,
      Phone: /(?:phone|tel[eé]fono|number)[:\s]+([\d().\s+-]+)/i,
      Project: /(?:project|proyecto|description|descripci[oó]n)[:\s]+([^\n]+)/i,
    }
    const lead = {}
    let count = 0
    for (const [key, regex] of Object.entries(patterns)) {
      const match = text.match(regex)
      if (match) { lead[key] = match[1].trim(); count++ }
    }
    return count >= 3 ? lead : null
  }, [])

  // Send message to Claude API / Enviar mensaje a Claude API
  const queryClaude = useCallback(async (allMessages) => {

    const res = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: allMessages,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error?.message || `API error ${res.status}`)
    }

    const data = await res.json()
    return data.content?.[0]?.text || 'No response received.'
  }, [])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const reply = await queryClaude(newMessages)
      const assistantMsg = { role: 'assistant', content: reply }
      const lead = extractLead(reply)
      if (lead) {
        assistantMsg.lead = lead
        saveLead(lead)
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ ${err.message}`
      }])
    } finally {
      setLoading(false)
    }
  }, [input, messages, loading, queryClaude, extractLead, saveLead])

  return (
    <div className="no-print">
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-5 w-[360px] max-w-[calc(100vw-32px)] h-[500px] max-h-[calc(100vh-120px)] rounded-2xl overflow-hidden flex flex-col shadow-2xl bg-white z-[9998]"
          style={{ animation: 'dlSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-dark to-brand flex items-center gap-3 px-4 py-3.5 min-h-[56px]">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-[15px]">DELIVERYLINK Assistant</div>
              <div className="text-white/75 text-xs">Online • EN/ES</div>
            </div>
            {leads.length > 0 && (
              <button onClick={() => setShowLeads(true)}
                aria-label={`View ${leads.length} saved lead${leads.length === 1 ? '' : 's'}`}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 transition">
                <Users size={14} aria-hidden="true" /> {leads.length}
              </button>
            )}
            <button onClick={() => setOpen(false)} aria-label="Close chat"
              className="w-8 h-8 flex items-center justify-center bg-white/15 hover:bg-white/25 rounded-lg transition">
              <X size={18} className="text-white" aria-hidden="true" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 bg-gradient-to-b from-slate-50 to-white">
            {messages.map((msg, i) => (
              <div key={i} className={`flex mb-2.5 px-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-brand-dark to-brand text-white rounded-2xl rounded-br-sm'
                    : 'bg-slate-100 text-slate-800 rounded-2xl rounded-bl-sm'
                }`}>
                  {msg.content}
                  {msg.lead && (
                    <div className="mt-2 p-3 bg-blue-50/80 rounded-xl border border-brand/20 text-xs">
                      <div className="font-bold text-brand-dark mb-1">📋 Lead Captured</div>
                      {Object.entries(msg.lead).map(([k, v]) => (
                        <div key={k}><strong className="text-brand-dark">{k}:</strong> {v}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-1 px-4 py-3 items-center">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-2 h-2 rounded-full bg-brand inline-block"
                    style={{ animation: 'dlBounce 1.4s infinite ease-in-out both', animationDelay: `${i * 0.16}s` }} />
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-slate-200 bg-white items-end">
            <textarea ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Type a message... / Escribe un mensaje..."
              aria-label="Type a message"
              rows={1}
              className="flex-1 border-1.5 border-slate-200 focus:border-brand rounded-xl px-3.5 py-2.5 text-sm resize-none outline-none max-h-20 overflow-y-auto font-[inherit]"
            />
            <button onClick={sendMessage} disabled={!input.trim() || loading} aria-label="Send message"
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition disabled:opacity-30 bg-blue-50 hover:bg-blue-100">
              <Send size={18} className="text-brand-dark" aria-hidden="true" />
            </button>
          </div>

          {/* Leads panel */}
          {showLeads && (
            <div className="absolute inset-0 bg-white z-10 flex flex-col rounded-2xl">
              <div className="bg-gradient-to-r from-brand-dark to-brand px-5 py-4 flex justify-between items-center rounded-t-2xl">
                <span className="text-white font-bold">Saved Leads ({leads.length})</span>
                <button onClick={() => setShowLeads(false)}
                  className="bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg px-3 py-1 transition">← Back</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {leads.length === 0 && <p className="text-slate-400 text-center mt-10">No leads yet</p>}
                {leads.map((lead, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3.5 mb-3 border border-slate-200 text-sm">
                    <div className="font-bold text-brand-dark mb-1">Lead #{i + 1} — {lead.timestamp}</div>
                    {Object.entries(lead).filter(([k]) => k !== 'timestamp').map(([k, v]) => (
                      <div key={k}><strong>{k}:</strong> {v}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      <button onClick={() => setOpen(p => !p)} aria-label={open ? 'Close chat' : 'Open chat'} aria-expanded={open}
        className="fixed bottom-24 md:bottom-5 right-4 sm:right-5 w-[60px] h-[60px] rounded-full border-none cursor-pointer z-[9999] bg-gradient-to-br from-brand-dark to-brand shadow-lg flex items-center justify-center transition-transform"
        style={{
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          animation: pulse ? 'dlPulse 2s infinite' : 'none',
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
        {open ? <X size={26} className="text-white" aria-hidden="true" /> : <MessageCircle size={26} className="text-white" aria-hidden="true" />}
      </button>
    </div>
  )
}

// ─── Capability Statement (Print) / Declaración de capacidades ───
function CapabilityStatement() {
  return (
    <section id="capability" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-5">
        <SectionTitle badge="Federal Contracting" title="Capability Statement"
          subtitle="Download our official capability statement for government contracting." />

        <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200 p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 pb-6 border-b border-slate-200">
            <div>
              <h3 className="text-2xl font-bold text-brand-dark">{COMPANY.name}</h3>
              <p className="text-slate-500 mt-1">IT Modernization & AI-Driven Automation</p>
            </div>
            <div className="no-print flex items-center gap-3">
              <a href="/DeliveryLink-Capability-Statement.pdf" download
                className="flex items-center gap-2 bg-brand-dark hover:bg-brand text-white font-semibold px-5 py-2.5 rounded-xl transition">
                <Download size={18} /> Download PDF
              </a>
              <button onClick={() => window.print()} aria-label="Print this page"
                className="flex items-center gap-2 border border-slate-200 hover:border-brand text-slate-600 font-medium px-4 py-2.5 rounded-xl transition text-sm">
                <Printer size={16} /> Print
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Building2 size={18} className="text-brand" /> Company Information
              </h4>
              <div className="space-y-1.5 text-sm text-slate-600">
                <p><strong>Owner:</strong> {COMPANY.owner}</p>
                <p><strong>Location:</strong> {COMPANY.location}</p>
                <p><strong>Phone:</strong> {COMPANY.phone}</p>
                <p><strong>Email:</strong> {COMPANY.email}</p>
                <p><strong>Website:</strong> {COMPANY.website}</p>
                <p><strong>UEI:</strong> {COMPANY.uei}</p>
                <p><strong>CAGE:</strong> {COMPANY.cage}</p>
                <p><strong>Business Type:</strong> Small Business, Hispanic American-Owned</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Briefcase size={18} className="text-brand" /> NAICS Codes
              </h4>
              <div className="space-y-1.5 text-sm text-slate-600">
                <p><strong>541511</strong> — Custom Computer Programming Services</p>
                <p><strong>541512</strong> — Computer Systems Design Services</p>
                <p><strong>541513</strong> — Computer Facilities Management</p>
                <p><strong>541519</strong> — Other Computer Related Services</p>
                <p><strong>541619</strong> — Other Management Consulting Services</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Star size={18} className="text-brand" /> Core Competencies
              </h4>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> Custom Software Development (React, Python, Node.js)</li>
                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> AI/LLM Integration (Claude API, GPT, NLP)</li>
                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> Cloud Architecture (Azure, AWS, Cloudflare)</li>
                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> Web Application Modernization (Section 508)</li>
                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> IT Strategic Consulting & Digital Transformation</li>
                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> Federal Procurement & Proposal Support</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Award size={18} className="text-brand" /> Certifications & Past Performance
              </h4>
              <div className="space-y-1.5 text-sm text-slate-600 mb-4">
                {CERTIFICATIONS.map((c, i) => (
                  <p key={i} className="flex items-start gap-2">
                    <Shield size={14} className="text-brand mt-0.5 flex-shrink-0" />
                    <span><strong>{c.label}</strong> — {c.detail}</span>
                  </p>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 font-semibold mb-1">KEY PROJECTS:</p>
                <p className="text-sm text-slate-600">• FinAdvisor Pro — AI financial platform</p>
                <p className="text-sm text-slate-600">• GovPilot AI — Federal readiness and opportunity intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Main App / Aplicación principal ───
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isAdmin = window.location.pathname === '/admin'
  const seoPage = SEO_PAGES.find(page => page.slug === window.location.pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  if (isAdmin) {
    return <AdminPage />
  }

  if (seoPage) {
    return <BlogLayout page={seoPage} />
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 pb-20 md:pb-0">
      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:bg-white focus:text-brand-dark focus:font-semibold focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg">
        Skip to main content
      </a>

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-slate-100' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center">
              <Code size={20} className="text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-lg text-slate-800">DELIVERYLINK</span>
          </a>

          <div className="hidden md:flex items-center gap-7">
            <NavLink href="#featured-product">Platform</NavLink>
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#projects">Projects</NavLink>
            <NavLink href="#capability">Capability</NavLink>
            <NavLink href="#contact">Contact</NavLink>
            <a href="#assessment-form"
              className="bg-brand-dark hover:bg-brand text-white font-semibold px-5 py-2 rounded-xl transition text-sm">
              {PRIMARY_CTA}
            </a>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen} aria-controls="mobile-menu">
            {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="md:hidden bg-white border-t border-slate-100 shadow-lg">
            <div className="flex flex-col p-5 gap-4">
              <NavLink href="#featured-product" onClick={closeMenu}>Platform</NavLink>
              <NavLink href="#services" onClick={closeMenu}>Services</NavLink>
              <NavLink href="#projects" onClick={closeMenu}>Projects</NavLink>
              <NavLink href="#capability" onClick={closeMenu}>Capability</NavLink>
              <NavLink href="#contact" onClick={closeMenu}>Contact</NavLink>
              <a href="#assessment-form" onClick={closeMenu}
                className="bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-xl text-center transition">
                {PRIMARY_CTA}
              </a>
            </div>
          </div>
        )}
      </nav>

      <main id="main-content" tabIndex={-1}>
      {/* ── Hero ── */}
      <section id="hero" className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-blue-50/60 to-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-brand-dark text-sm font-semibold px-4 py-1.5 rounded-full mb-6 animate-fadeInUp">
                <Shield size={14} /> Limited-time first customer offer
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-5 animate-fadeInUp delay-100">
                {PRIMARY_OFFER}
              </h1>
              <p className="text-lg md:text-xl text-slate-500 mb-8 max-w-xl animate-fadeInUp delay-200">
                Find out in 15 minutes if your business is actually ready to compete for federal contracts.
              </p>
              <div className="flex flex-wrap gap-4 animate-fadeInUp delay-300">
                <a href="#assessment-form"
                  className="inline-flex items-center gap-2 bg-brand-dark hover:bg-brand text-white font-semibold px-7 py-4 rounded-xl transition text-base shadow-lg shadow-brand-dark/20">
                  {PRIMARY_CTA} <ArrowRight size={18} />
                </a>
                <a href={WHATSAPP_URL}
                  className="inline-flex items-center gap-2 border-2 border-slate-200 hover:border-brand text-slate-700 font-semibold px-7 py-4 rounded-xl transition text-base">
                  Get Free Review on WhatsApp <MessageCircle size={18} />
                </a>
              </div>

              <div className="flex flex-wrap gap-6 mt-10 text-sm text-slate-500 animate-fadeInUp delay-400">
                <span className="flex items-center gap-1.5"><CheckCircle size={16} className="text-green-500" /> 15-minute review</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={16} className="text-green-500" /> No obligation</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={16} className="text-green-500" /> Built for small businesses</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xl shadow-brand-dark/10 animate-fadeInUp delay-200">
              <div className="flex items-center gap-2 text-brand-dark font-bold text-sm mb-4">
                <Clock size={18} /> Today only
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-5">{PRIMARY_OFFER}</h2>
              <p className="font-semibold text-slate-700 mb-4">You will receive:</p>
              <ul className="space-y-3 text-slate-600 mb-6">
                {['Readiness Score', 'Missing registrations', 'Capability Statement review', 'Next 5 actions', 'Live Q&A'].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Value</div>
                  <div className="text-2xl font-extrabold text-slate-400 line-through">$297</div>
                </div>
                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                  <div className="text-xs font-semibold text-green-700 uppercase">Today</div>
                  <div className="text-2xl font-extrabold text-green-700">FREE</div>
                </div>
              </div>
              <a href="#assessment-form"
                className="inline-flex w-full items-center justify-center gap-2 bg-brand-dark hover:bg-brand text-white font-semibold px-6 py-4 rounded-xl transition text-base shadow-lg shadow-brand-dark/20">
                {PRIMARY_CTA} <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Government Readiness Assessment ── */}
      <section id="readiness" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <SectionTitle badge="AI Assessment" title="Government Readiness Assessment"
            subtitle="Quickly understand the registrations, identifiers, documents, codes, and opportunity fit your business needs to compete." />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {READINESS_ITEMS.map((item, i) => <IconCard key={i} {...item} />)}
          </div>

          <div className="text-center mt-10">
            <a href="#assessment-form"
              className="inline-flex items-center gap-2 bg-brand-dark hover:bg-brand text-white font-semibold px-6 py-3 rounded-xl transition text-base shadow-lg shadow-brand-dark/20">
              {PRIMARY_CTA} <ArrowRight size={18} />
            </a>
          </div>

          <ReadinessAssessment />
        </div>
      </section>

      {/* ── Featured Product ── */}
      <section id="featured-product" className="py-20 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-5">
          <SectionTitle badge="Featured Product" title={FEATURED_PRODUCT.name}
            subtitle={FEATURED_PRODUCT.desc} />

          <div className="bg-white rounded-2xl border border-slate-100 p-8 md:p-10 hover:shadow-lg hover:border-brand/20 transition-all">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                  <Bot size={28} className="text-brand-dark" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">GovPilot AI</h3>
                <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
                  AI-powered intelligence platform designed to help businesses evaluate, prepare and compete for U.S. Government contracts.
                </p>
              </div>

              <div className="flex flex-wrap md:flex-col gap-4">
                <a href="#assessment-form"
                  className="inline-flex items-center justify-center gap-2 bg-brand-dark hover:bg-brand text-white font-semibold px-6 py-3 rounded-xl transition text-base shadow-lg shadow-brand-dark/20">
                  {PRIMARY_CTA} <ArrowRight size={18} />
                </a>
                <a href="#assessment-form"
                  className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-brand text-slate-700 font-semibold px-6 py-3 rounded-xl transition text-base">
                  {PRIMARY_CTA} <ChevronRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <SectionTitle badge="What We Do" title="Services & Expertise"
            subtitle="End-to-end support for businesses preparing to compete in the federal marketplace." />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc, i) => (
              <IconCard key={i} icon={svc.icon} title={svc.title}
                desc={(
                  <>
                    <span className="text-brand font-semibold text-sm mb-3 flex items-center gap-1">
                      <DollarSign size={14} /> {svc.rate}
                    </span>
                    <span>{svc.desc}</span>
                  </>
                )} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <SectionTitle badge="Our Work" title="Past Performance"
            subtitle="Proven delivery on complex technical projects." />

          <div className="grid md:grid-cols-3 gap-6">
            {PROJECTS.map((proj, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-brand-dark/10 flex items-center justify-center mb-4">
                  <Star size={20} className="text-brand-dark" />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">{proj.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{proj.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((tag, j) => (
                    <span key={j} className="bg-white border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section id="why-deliverylink" className="py-20 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-5">
          <SectionTitle badge="Why DeliveryLink" title="Why Businesses Choose DeliveryLink"
            subtitle="Practical AI and contracting intelligence for small businesses entering the federal market." />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SOCIAL_PROOF.map((item, i) => <IconCard key={i} {...item} />)}
          </div>
        </div>
      </section>

      {/* ── Capability Statement ── */}
      <CapabilityStatement />

      {/* ── Final CTA / Contact ── */}
      <section id="contact" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-5">
          <SectionTitle badge="Free Review" title={PRIMARY_OFFER}
            subtitle="Find out in 15 minutes if your business is actually ready to compete for federal contracts." />

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a href="#assessment-form"
              className="inline-flex items-center gap-2 bg-brand-dark hover:bg-brand text-white font-semibold px-6 py-3 rounded-xl transition text-base shadow-lg shadow-brand-dark/20">
              {PRIMARY_CTA} <ArrowRight size={18} />
            </a>
            <a href={WHATSAPP_URL}
              className="inline-flex items-center gap-2 border-2 border-slate-200 hover:border-brand text-slate-700 font-semibold px-6 py-3 rounded-xl transition text-base">
              Get Free Review on WhatsApp <MessageCircle size={18} />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <a href={`mailto:${COMPANY.email}`}
              className="flex flex-col items-center gap-3 bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-brand/20 transition-all text-center group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-brand-dark flex items-center justify-center transition-colors">
                <Mail size={24} className="text-brand-dark group-hover:text-white transition-colors" />
              </div>
              <div>
                <div className="font-bold text-slate-800 mb-1">Email</div>
                <div className="text-brand text-sm font-medium">{COMPANY.email}</div>
              </div>
            </a>

            <a href={`tel:${COMPANY.phone.replace(/[^\d+]/g, '')}`}
              className="flex flex-col items-center gap-3 bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-brand/20 transition-all text-center group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-brand-dark flex items-center justify-center transition-colors">
                <Phone size={24} className="text-brand-dark group-hover:text-white transition-colors" />
              </div>
              <div>
                <div className="font-bold text-slate-800 mb-1">Phone</div>
                <div className="text-brand text-sm font-medium">{COMPANY.phone}</div>
              </div>
            </a>

            <div className="flex flex-col items-center gap-3 bg-white rounded-2xl border border-slate-100 p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                <MapPin size={24} className="text-brand-dark" />
              </div>
              <div>
                <div className="font-bold text-slate-800 mb-1">Location</div>
                <div className="text-slate-500 text-sm">{COMPANY.location}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center">
                <Code size={16} className="text-white" />
              </div>
              <span className="font-bold text-white">{COMPANY.name}</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#services" className="hover:text-white transition">Services</a>
              <a href="#projects" className="hover:text-white transition">Projects</a>
              <a href="#capability" className="hover:text-white transition">Capability</a>
              <a href="#contact" className="hover:text-white transition">Contact</a>
            </div>

            <div className="text-sm text-center md:text-right">
              <a href={`mailto:${COMPANY.email}`} className="hover:text-white transition">{COMPANY.email}</a>
              <span className="mx-2">•</span>
              <span>{COMPANY.phone}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
            <span className="mx-2">|</span>
            UEI: {COMPANY.uei} <span className="mx-1">|</span> CAGE: {COMPANY.cage}
          </div>
        </div>
      </footer>

      {/* ── Chat Widget ── */}
      <FloatingConversionButtons />
      <ChatWidget />
    </div>
  )
}
