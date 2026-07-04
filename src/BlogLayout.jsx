import { useEffect } from 'react'
import { ArrowRight, CheckCircle, MessageCircle } from 'lucide-react'
import { SEO_PAGES, SITE_URL, ctaText } from './seoContent'
import { trackCtaClick, trackWhatsAppClick } from './analytics'

function setMeta(name, content, property = false) {
  const attr = property ? 'property' : 'name'
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setCanonical(url) {
  let tag = document.head.querySelector('link[rel="canonical"]')
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', 'canonical')
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', url)
}

function SeoMeta({ page }) {
  useEffect(() => {
    const url = `${SITE_URL}${page.slug}`
    document.title = page.metaTitle
    setMeta('description', page.metaDescription)
    setMeta('keywords', page.keywords.join(', '))
    setMeta('og:title', page.metaTitle, true)
    setMeta('og:description', page.metaDescription, true)
    setMeta('og:url', url, true)
    setMeta('og:type', 'article', true)
    setMeta('twitter:title', page.metaTitle)
    setMeta('twitter:description', page.metaDescription)
    setCanonical(url)
  }, [page])

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }

  return (
    <script type="application/ld+json">
      {JSON.stringify(faqSchema)}
    </script>
  )
}

function ArticleCta() {
  return (
    <div className="my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50/80 to-white p-6 md:p-8">
      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
        <div>
          <p className="text-sm font-bold text-brand-dark mb-2">FREE Government Contract Readiness Review</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">Find out what is blocking your first federal opportunity.</h2>
          <p className="text-slate-600 leading-relaxed">
            In 15 minutes, DeliveryLink reviews your registrations, readiness score, capability statement position, and next five actions.
          </p>
        </div>
        <a href="/#assessment-form"
          onClick={() => trackCtaClick(ctaText, 'article_cta')}
          className="inline-flex items-center justify-center gap-2 bg-brand-dark hover:bg-brand text-white font-semibold px-6 py-4 rounded-xl transition shadow-lg shadow-brand-dark/20">
          {ctaText} <ArrowRight size={18} />
        </a>
      </div>
    </div>
  )
}

function InternalLinks({ currentSlug }) {
  const currentPage = SEO_PAGES.find(page => page.slug === currentSlug)
  const coreLinks = SEO_PAGES.filter(page => page.type !== 'industry' && page.slug !== currentSlug).slice(0, 6)
  const industryLinks = SEO_PAGES.filter(page => page.type === 'industry' && page.slug !== currentSlug).slice(0, currentPage?.type === 'industry' ? 6 : 10)
  const links = [...coreLinks, ...industryLinks]

  return (
    <section className="mt-12 rounded-2xl border border-slate-100 bg-white p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Related government contracting guides</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {links.map(page => (
          <a key={page.slug} href={page.slug}
            className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-brand/30 hover:bg-blue-50/40 transition">
            <h3 className="font-bold text-slate-900 mb-1">{page.title}</h3>
            <p className="text-sm text-slate-500">{page.excerpt}</p>
          </a>
        ))}
      </div>
    </section>
  )
}

export default function BlogLayout({ page }) {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <SeoMeta page={page} />
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="/" className="font-bold text-slate-900">DELIVERYLINK</a>
          <a href="/#assessment-form"
            onClick={() => trackCtaClick(ctaText, 'blog_nav')}
            className="bg-brand-dark hover:bg-brand text-white font-semibold px-4 py-2 rounded-xl transition text-sm">
            {ctaText}
          </a>
        </div>
      </header>

      <main>
        <article className="max-w-4xl mx-auto px-5 py-12 md:py-16">
          <div className="mb-10">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-brand-dark text-sm font-semibold rounded-full mb-5">
              Government Contracting Guide
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-5">{page.title}</h1>
            <p className="text-xl text-slate-500 leading-relaxed">{page.excerpt}</p>
          </div>

          <ArticleCta />

          <div className="prose prose-slate max-w-none">
            {page.sections.map(([heading, first, second], index) => (
              <section key={heading} className="mb-9">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{heading}</h2>
                <p className="text-slate-600 leading-8 mb-4">{first}</p>
                <p className="text-slate-600 leading-8">{second}</p>
                {index === 2 && (
                  <div className="my-8 rounded-2xl border border-slate-100 bg-slate-50 p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Readiness checklist</h3>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {['Business entity and EIN are consistent', 'UEI and SAM.gov status are understood', 'NAICS codes match real buying patterns', 'Capability statement is buyer-ready', 'Target agencies and primes are identified', 'Next five actions are prioritized'].map(item => (
                        <li key={item} className="flex items-start gap-2 text-slate-600">
                          <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {index === 5 && <ArticleCta />}
              </section>
            ))}

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">A practical 30-day action plan</h2>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Week 1: Confirm the foundation</h3>
              <p className="text-slate-600 leading-8 mb-4">Review entity information, tax details, address consistency, identifiers, SAM.gov status, and NAICS assumptions. Do not start outreach until the business can explain its status clearly.</p>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Week 2: Package the offer</h3>
              <p className="text-slate-600 leading-8 mb-4">Rewrite the capability statement around outcomes, proof, differentiators, and buyer language. Build a short email version and a one-page PDF version.</p>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Week 3: Build the target list</h3>
              <p className="text-slate-600 leading-8 mb-4">Identify agencies, offices, primes, and recurring contract categories that match the business. Remove poor-fit opportunities quickly so time stays focused.</p>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Week 4: Start controlled outreach</h3>
              <p className="text-slate-600 leading-8">Send tailored messages, track replies, refine positioning, and choose opportunities based on fit rather than excitement. The goal is a repeatable pipeline, not a one-time search.</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Federal buyer readiness signals</h2>
              <p className="text-slate-600 leading-8 mb-4">
                Federal buyers and prime contractors look for signals that a company will be easy to evaluate and low-risk to work with. Those signals include an active registration posture, clear NAICS alignment, a direct point of contact, a concise capability statement, relevant past performance, and a service description that maps cleanly to a real requirement. When those pieces are missing, the buyer has to work harder to understand the company. In a competitive environment, that extra friction can be enough to end the conversation.
              </p>
              <p className="text-slate-600 leading-8">
                A small business does not need to sound like a large defense contractor. It needs to sound prepared. Prepared means the owner understands what the business sells, which agencies or primes are most likely to buy it, what registrations are complete, what proof exists, and what the next action should be. This is why a readiness review is valuable before aggressive outreach. It converts uncertainty into a short operational checklist that can be executed quickly.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Mistakes that slow down first-time contractors</h2>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Chasing every opportunity</h3>
              <p className="text-slate-600 leading-8 mb-4">
                New contractors often treat every notice as a potential win. That creates wasted time and weak proposals. A better process filters by service fit, location, contract size, buyer history, deadline, compliance burden, and proof requirements. If the opportunity does not match the company’s current readiness level, it should be saved for learning, not pursued as a priority.
              </p>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Using generic positioning</h3>
              <p className="text-slate-600 leading-8 mb-4">
                Generic positioning makes a business forgettable. Federal buyers need to know exactly what problem the company solves and why it is credible. Replace broad claims with specific services, outcomes, locations, tools, credentials, response capacity, and relevant examples. Specificity makes outreach easier to understand and easier to forward.
              </p>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Waiting too long to ask for help</h3>
              <p className="text-slate-600 leading-8">
                Many owners wait until they are confused by a solicitation or stuck in SAM.gov before asking for help. The smarter move is to review readiness early. A short review can identify missing registrations, weak capability language, poor NAICS choices, and unrealistic target opportunities before they cost weeks of effort.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">FAQ</h2>
              <div className="space-y-4">
                {page.faq.map(([question, answer]) => (
                  <div key={question} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{question}</h3>
                    <p className="text-slate-600 leading-7">{answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <InternalLinks currentSlug={page.slug} />

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="/#assessment-form"
              onClick={() => trackCtaClick(ctaText, 'article_footer')}
              className="inline-flex items-center gap-2 bg-brand-dark hover:bg-brand text-white font-semibold px-6 py-4 rounded-xl transition shadow-lg shadow-brand-dark/20">
              {ctaText} <ArrowRight size={18} />
            </a>
            <a href="https://wa.me/15616790314?text=I%20want%20my%20free%20Government%20Contract%20Readiness%20Review."
              onClick={() => trackWhatsAppClick('article_footer')}
              className="inline-flex items-center gap-2 border-2 border-slate-200 hover:border-brand text-slate-700 font-semibold px-6 py-4 rounded-xl transition">
              Ask on WhatsApp <MessageCircle size={18} />
            </a>
          </div>
        </article>
      </main>
    </div>
  )
}
