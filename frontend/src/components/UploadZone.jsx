import { useState, useRef } from 'react'

export default function UploadZone({ onUpload, loading }) {
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef()

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setPreview(URL.createObjectURL(file))
    onUpload(file)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div
        onClick={() => !loading && inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          width: 280, height: 280,
          borderRadius: '50%',
          border: `2px dashed ${dragging ? 'var(--green)' : 'var(--border)'}`,
          background: dragging ? 'var(--green-dim)' : 'var(--surface)',
          cursor: loading ? 'default' : 'pointer',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          position: 'relative',
          boxShadow: dragging ? '0 0 0 4px rgba(0,230,118,0.15)' : 'none',
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="Your photo"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.6 }}>📸</div>
            <div style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 600,
              fontSize: 16,
              color: 'var(--text)',
              textAlign: 'center',
              lineHeight: 1.4,
              padding: '0 24px',
            }}>
              Drop your selfie<br />
              <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 14 }}>
                or click to browse
              </span>
            </div>
          </>
        )}

        {loading && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(10,13,18,0.75)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 12,
          }}>
            <Spinner />
            <span style={{ fontFamily: 'var(--font-head)', fontSize: 14, color: 'var(--green)' }}>
              Analysing face...
            </span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {!preview && (
        <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center' }}>
          Works best with a clear, front-facing photo with good lighting
        </p>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <div style={{
      width: 36, height: 36,
      border: '3px solid rgba(0,230,118,0.2)',
      borderTopColor: 'var(--green)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  )
}
