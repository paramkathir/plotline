import { Screen } from '../App.tsx'
import { BookOpen, Library } from 'lucide-react'

export default function Landing({ setScreen }: { setScreen: (s: Screen) => void }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#080b12',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>

      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{
          fontSize: '11px', letterSpacing: '6px', color: '#6366f1',
          textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'Segoe UI, sans-serif'
        }}>
          Interactive Fiction
        </div>
        <h1 style={{
          fontSize: '72px', fontWeight: 400, color: '#ffffff',
          letterSpacing: '8px', textTransform: 'uppercase',
          fontFamily: 'Georgia, serif', lineHeight: 1
        }}>
          PlotLine
        </h1>
        <div style={{
          width: '60px', height: '1px', background: '#6366f1',
          margin: '24px auto', opacity: 0.6
        }} />
        <p style={{
          color: '#555', fontSize: '15px', letterSpacing: '1px',
          fontFamily: 'Georgia, serif', fontStyle: 'italic'
        }}>
          Your story. Your choices. Your world.
        </p>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '280px' }}>
        <button
          onClick={() => setScreen('setup')}
          style={{
            background: '#6366f1', border: 'none', borderRadius: '4px',
            padding: '16px 32px', color: '#fff', fontSize: '13px',
            letterSpacing: '2px', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#4f52d4')}
          onMouseLeave={e => (e.currentTarget.style.background = '#6366f1')}
        >
          <BookOpen size={16} />
          Begin New Story
        </button>

        <button
          onClick={() => setScreen('mystories')}
          style={{
            background: 'transparent', border: '1px solid #2a2d3a', borderRadius: '4px',
            padding: '16px 32px', color: '#888', fontSize: '13px',
            letterSpacing: '2px', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2d3a'; e.currentTarget.style.color = '#888' }}
        >
          <Library size={16} />
          My Stories
        </button>
      </div>

      {/* Footer */}
      <div style={{
        position: 'fixed', bottom: '24px',
        color: '#2a2d3a', fontSize: '11px', letterSpacing: '2px',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        PLOTLINE
      </div>
    </div>
  )
}