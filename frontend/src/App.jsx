import { useState } from 'react'
import UploadZone from './components/UploadZone.jsx'
import ResultCard from './components/ResultCard.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [state, setState] = useState('idle') 
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [userPhotoURL, setUserPhotoURL] = useState(null)

  const handleUpload = async (file) => {
    setState('loading')
    setError(null)
    setUserPhotoURL(URL.createObjectURL(file))

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`${API}/match`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Something went wrong. Please try again.')
      }

      const data = await res.json()
      setResult(data)
      setState('result')

    } catch (err) {
      setError(err.message)
      setState('error')
    }
  }

  const handleReset = () => {
    setState('idle')
    setResult(null)
    setError(null)
    setUserPhotoURL(null)
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px 80px',
      }}>

        <header style={{ textAlign: 'center', marginBottom: 48, maxWidth: 520 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--green-dim)',
            border: '1px solid rgba(0,230,118,0.2)',
            borderRadius: 99,
            padding: '6px 16px',
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 14, color: 'var(--green)', fontWeight: 500 }}>
              Powered by FaceNet + KNN
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 700,
            fontSize: 'clamp(32px, 6vw, 52px)',
            lineHeight: 1.15,
            letterSpacing: -1,
            marginBottom: 16,
          }}>
            Which footballer
            <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--green) 0%, #69f0ae 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              do you look like?
            </span>
          </h1>

          <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.6 }}>
            Upload a selfie. Our AI extracts your face's feature vector
            and finds your closest match among 20 World Cup 2026 players.
          </p>
        </header>

        {/* Main content */}
        <main style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>

          {state === 'idle' && (
            <div className="fade-up">
              <UploadZone onUpload={handleUpload} loading={false} />
            </div>
          )}

          {state === 'loading' && (
            <div className="fade-up">
              <UploadZone onUpload={handleUpload} loading={true} />
            </div>
          )}

          {state === 'result' && result && (
            <div className="fade-up" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <ResultCard
                result={result}
                userPhoto={userPhotoURL}
                onReset={handleReset}
              />
            </div>
          )}

          {state === 'error' && (
            <div className="fade-up" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
            }}>
              <div style={{
                background: 'rgba(255,107,107,0.08)',
                border: '1px solid rgba(255,107,107,0.2)',
                borderRadius: 16,
                padding: '20px 28px',
                textAlign: 'center',
                maxWidth: 380,
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>😕</div>
                <p style={{ fontFamily: 'var(--font-head)', fontWeight: 600, marginBottom: 8 }}>
                  Couldn't process that photo
                </p>
                <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.5 }}>
                  {error}
                </p>
              </div>
              <button
                onClick={handleReset}
                style={{
                  padding: '12px 32px',
                  borderRadius: 99,
                  background: 'var(--green)',
                  color: '#0a0d12',
                  fontFamily: 'var(--font-head)',
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                Try again
              </button>
            </div>
          )}
        </main>

        <footer style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '12px 20px',
          background: 'linear-gradient(transparent, var(--bg))',
          textAlign: 'center',
        }}>
          <p style={{ color: 'var(--muted)', fontSize: 12 }}>
            Photos are processed locally and never stored ·
          </p>
        </footer>

      </div>
    </>
  )
}
