import PageTransition from '../components/PageTransition'
import SplitText from '../components/SplitText'
import { useAggressivePageGsap } from '../animations/useAggressivePageGsap'
import { useLanguage } from '../context/LanguageContext'
import { i18nStrings } from '../data/i18n'
import { useMediaQuery } from '../hooks/useMediaQuery'

export default function Agency() {
  const { lang } = useLanguage()
  const t = i18nStrings[lang]
  const pageRef = useAggressivePageGsap([lang])

  const isMobile = useMediaQuery('(max-width: 768px)')

  if (isMobile) {
    return (
      <PageTransition>
        <div style={{ paddingBottom: '5rem' }}>
          <header className="gsap-reveal" style={{ marginBottom: '4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', opacity: 0.5 }}>{t.agency_kicker}</span>
            <h1 className="no-word-break-mobile" style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.85, marginTop: '1rem' }}>
              {t.agency_title_a}<br/>
              <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--text-primary)' }}>{t.agency_title_b}</span>
            </h1>
            <p style={{ marginTop: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.6 }}>
               Michel Branche // {t.agency_subtitle}
            </p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {t.agency_sections.map(section => (
              <div key={section.num} className="gsap-card">
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '0.2rem 0.5rem' }}>{section.num}</span>
                    <hr style={{ flex: 1, border: 'none', height: '1px', background: 'var(--c-border)' }} />
                 </div>
                 <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>{section.title}</h3>
                 <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.7 }}>{section.content}</p>
              </div>
            ))}
          </div>

          <div className="gsap-page-footer" style={{ marginTop: '6rem', padding: '2rem', border: '1px solid var(--c-border)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <span>{t.agency_footer_version}</span>
             <span>{t.agency_footer_infra}</span>
             <span>{t.agency_footer_location}</span>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div ref={pageRef} style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Grid */}
        <div className="gsap-page-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', background: 'var(--c-border)', border: '1px solid var(--c-border)', marginBottom: 'clamp(3rem, 8vw, 6rem)' }}>
          <div className="mobile-full-width mobile-p-2" style={{ background: 'var(--bg-primary)', padding: '4rem' }}>
            <SplitText type="words" delay={0.4} contentKey={lang}>
              <header className="gsap-page-header">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  {t.agency_kicker}
                </span>
                <h1 className="no-word-break-mobile" style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: 'clamp(2.5rem, 10vw, 5.5rem)', 
                  fontWeight: 900, 
                  textTransform: 'uppercase', 
                  lineHeight: 0.85, 
                  marginTop: '1.5rem', 
                  marginBottom: '4rem' 
                }}>
                  {t.agency_title_a} <br/>
                  <span style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--text-primary)' }}>{t.agency_title_b}</span>
                </h1>
              </header>
            </SplitText>
          </div>
          <div className="mobile-full-width mobile-p-2" style={{ background: 'var(--bg-primary)', padding: '4rem', display: 'flex', alignItems: 'flex-end' }}>
            <SplitText type="lines" delay={0.6} contentKey={lang}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Michel Branche<br/>{t.agency_subtitle}
              </p>
            </SplitText>
          </div>
        </div>


        {/* Modular Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
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
