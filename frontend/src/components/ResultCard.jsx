import { useState, useEffect } from 'react'

export default function ResultCard({ result, userPhoto, onReset }) {
  const { top_match, top_5 } = result
  const [animPct, setAnimPct] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500)

  useEffect(() => {
    const t = setTimeout(() => setAnimPct(top_match.similarity_pct), 100)
    return () => clearTimeout(t)
  }, [top_match])

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 500)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  const pctColor =
    top_match.similarity_pct >= 75 ? '#00e676' :
    top_match.similarity_pct >= 55 ? '#ffd700' : '#ff6b6b'

  const faceSize = isMobile ? 90 : 120

  return (
    <div style={{ width: '100%', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: isMobile ? '20px 16px' : '28px 24px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? 16 : 0,
      }}>

        {isMobile ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', justifyContent: 'center' }}>
              <FaceCard src={userPhoto} label="YOU" sub="" accent="#7a8499" size={faceSize} />
              <div style={{
                fontFamily: 'var(--font-head)', fontWeight: 700,
                fontSize: 18, color: 'var(--muted)', letterSpacing: 4,
                padding: '0 8px',
              }}>VS</div>
              <FaceCard
                src={top_match.image_url}
                label={top_match.name.split(' ').pop().toUpperCase()}
                sub={top_match.nationality}
                accent="var(--green)"
                size={faceSize}
              />
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 32, color: pctColor }}>
                {top_match.similarity_pct}%
              </span>
              <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                similarity match
              </span>
              <div style={{ width: '100%', height: 6, background: 'var(--surface-2)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${animPct}%`,
                  background: `linear-gradient(90deg, var(--green), ${pctColor})`,
                  borderRadius: 99,
                  transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
                {top_match.name} · {top_match.club}
              </div>
            </div>
          </>
        ) : (
          <>
            <FaceCard src={userPhoto} label="YOU" sub="" accent="#7a8499" size={faceSize} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '0 16px' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 20, color: 'var(--muted)', letterSpacing: 4 }}>VS</div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 28, color: pctColor }}>
                  {top_match.similarity_pct}%
                </span>
                <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5 }}>match</span>
                <div style={{ width: '100%', height: 6, background: 'var(--surface-2)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${animPct}%`,
                    background: `linear-gradient(90deg, var(--green), ${pctColor})`,
                    borderRadius: 99,
                    transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} />
                </div>
              </div>
            </div>
            <FaceCard src={top_match.image_url} label={top_match.name.toUpperCase()} sub={`${top_match.nationality} · ${top_match.position}`} accent="var(--green)" size={faceSize} />
          </>
        )}
      </div>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '20px 16px 8px',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 600,
          color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14,
        }}>Other close matches</h3>
        {top_5.slice(1).map((f, i) => <Top5Row key={f.name} footballer={f} rank={i + 2} />)}
      </div>

      <button
        onClick={onReset}
        style={{
          alignSelf: 'center', padding: '12px 32px', borderRadius: 99,
          background: 'var(--surface)', border: '1px solid var(--border)',
          color: 'var(--text)', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 15,
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        Try another photo ↩
      </button>
    </div>
  )
}

function FaceCard({ src, label, sub, accent, size }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: size + 20, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%', overflow: 'hidden',
        border: `2px solid ${accent}`, background: 'var(--surface-2)',
      }}>
        <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 11, color: accent, letterSpacing: 1 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  )
}

function Top5Row({ footballer, rank }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid var(--border)' }}>
      <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, color: 'var(--muted)', width: 20, textAlign: 'center' }}>
        #{rank}
      </span>
      <img src={footballer.image_url} alt={footballer.name}
        style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {footballer.name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{footballer.nationality} · {footballer.club}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 15, color: footballer.similarity_pct >= 60 ? 'var(--green)' : 'var(--muted)', flexShrink: 0 }}>
        {footballer.similarity_pct}%
      </div>
    </div>
  )
}