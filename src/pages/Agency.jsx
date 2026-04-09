import PageTransition from '../components/PageTransition'
import SplitText from '../components/SplitText'
import { useAggressivePageGsap } from '../animations/useAggressivePageGsap'
import { useLanguage } from '../context/LanguageContext'
import { i18nStrings } from '../data/i18n'

export default function Agency() {
  const { lang } = useLanguage()
  const t = i18nStrings[lang]
  const pageRef = useAggressivePageGsap([lang])

  return (
    <PageTransition>
      <div ref={pageRef} style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Grid */}
        <div className="gsap-page-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1px', background: 'var(--c-border)', border: '1px solid var(--c-border)', marginBottom: '6rem' }}>
          <div style={{ gridColumn: '1 / 9', background: 'var(--bg-primary)', padding: '4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              {t.agency_kicker}
            </span>
            
            <SplitText type="words" delay={0.4} contentKey={lang}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 10vw, 8rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.85, marginTop: '2rem', letterSpacing: '-0.04em' }}>
                {t.agency_title_a}<br/>
                <span style={{ color: 'transparent', WebkitTextStroke: '2px var(--text-primary)' }}>{t.agency_title_b}</span>
              </h1>
            </SplitText>
          </div>
          <div style={{ gridColumn: '9 / 13', background: 'var(--bg-primary)', padding: '4rem', display: 'flex', alignItems: 'flex-end' }}>
            <SplitText type="lines" delay={0.6} contentKey={lang}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Michel Branche<br/>{t.agency_subtitle}
              </p>
            </SplitText>
          </div>
        </div>

        {/* Modular Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
          {t.agency_sections.map(section => (
            <div key={section.num} className="gsap-card" style={{ borderTop: '1px solid var(--text-primary)', paddingTop: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{section.num}</span>
              
              <SplitText scroll type="words" contentKey={`${lang}-${section.num}-title`}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase', margin: '1rem 0' }}>{section.title}</h3>
              </SplitText>
              
              <SplitText scroll type="lines" contentKey={`${lang}-${section.num}-body`}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  {section.content}
                </p>
              </SplitText>
            </div>
          ))}
        </div>

        {/* Footer Technicality */}
        <div className="gsap-page-footer" style={{ marginTop: '8rem', border: '1px solid var(--c-border)', padding: '2rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          <span>{t.agency_footer_version}</span>
          <span>{t.agency_footer_infra}</span>
          <span>{t.agency_footer_location}</span>
        </div>

      </div>
    </PageTransition>
  )
}
