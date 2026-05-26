import { useState } from 'react'
import { supabase } from '../supabase.ts'
import { Screen, StoryConfig } from '../App.tsx'
import { ArrowLeft, Sparkles } from 'lucide-react'

const GENRES = ['Fantasy', 'Sci-Fi', 'Horror', 'Romance', 'Mystery', 'Thriller', 'Historical', 'Western']
const TONES = ['Epic and grand', 'Dark and gritty', 'Mysterious and eerie', 'Romantic and poetic', 'Tense and suspenseful', 'Lighthearted and fun']

function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '11px', letterSpacing: '2px', color: '#6366f1', textTransform: 'uppercase', fontFamily: 'Segoe UI, sans-serif' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  background: '#0f1420', border: '1px solid #1e2235', borderRadius: '4px',
  padding: '12px 16px', color: '#e0e0e0', fontSize: '14px', outline: 'none',
  fontFamily: 'Segoe UI, sans-serif', width: '100%', boxSizing: 'border-box' as const
}

export default function Setup({ setScreen, setStoryConfig }: {
  setScreen: (s: Screen) => void
  setStoryConfig: (c: StoryConfig) => void
}) {
  const [title, setTitle]           = useState('')
  const [genre, setGenre]           = useState('Fantasy')
  const [protagonist, setProtagonist] = useState('')
  const [world, setWorld]           = useState('')
  const [tone, setTone]             = useState('Epic and grand')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  async function handleStart() {
    if (!title.trim())       { setError('Give your story a title'); return }
    if (!protagonist.trim()) { setError('Name your protagonist'); return }
    if (!world.trim())       { setError('Describe your world'); return }

    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('stories').insert({
      title: title.trim(),
      genre,
      protagonist: protagonist.trim(),
      world: world.trim(),
      tone,
      user_id: user!.id
    }).select().single()

    if (error) { setError(error.message); setLoading(false); return }

    setStoryConfig({ id: data.id, title, genre, protagonist, world, tone })
    setScreen('story')
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#080b12',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '40px 20px'
    }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
          <button
            onClick={() => setScreen('landing')}
            style={{ background: 'none', border: 'none', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', letterSpacing: '1px' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#555')}
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '4px', color: '#6366f1', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'Segoe UI, sans-serif' }}>
            New Story
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 400, color: '#fff', fontFamily: 'Georgia, serif' }}>
            Set the Stage
          </h2>
          <p style={{ color: '#555', fontSize: '14px', marginTop: '8px', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Every great story begins with a world worth exploring.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <Field label="Story Title">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="The name of your story"
              style={inputStyle}
            />
          </Field>

          <Field label="Genre">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {GENRES.map(g => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  style={{
                    padding: '8px 16px', borderRadius: '4px', fontSize: '13px',
                    border: `1px solid ${genre === g ? '#6366f1' : '#1e2235'}`,
                    background: genre === g ? 'rgba(99,102,241,0.15)' : 'transparent',
                    color: genre === g ? '#6366f1' : '#666',
                    transition: 'all 0.15s', fontFamily: 'Segoe UI, sans-serif'
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Protagonist Name">
            <input
              value={protagonist}
              onChange={e => setProtagonist(e.target.value)}
              placeholder="Who is your main character?"
              style={inputStyle}
            />
          </Field>

          <Field label="World Description">
            <textarea
              value={world}
              onChange={e => setWorld(e.target.value)}
              placeholder="Describe the world, setting, and atmosphere..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Field>

          <Field label="Tone">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {TONES.map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  style={{
                    padding: '8px 16px', borderRadius: '4px', fontSize: '13px',
                    border: `1px solid ${tone === t ? '#6366f1' : '#1e2235'}`,
                    background: tone === t ? 'rgba(99,102,241,0.15)' : 'transparent',
                    color: tone === t ? '#6366f1' : '#666',
                    transition: 'all 0.15s', fontFamily: 'Segoe UI, sans-serif'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>

          {error && (
            <div style={{ color: '#f87171', fontSize: '13px', fontFamily: 'Segoe UI, sans-serif' }}>{error}</div>
          )}

          <button
            onClick={handleStart}
            disabled={loading}
            style={{
              background: '#6366f1', border: 'none', borderRadius: '4px',
              padding: '16px', color: '#fff', fontSize: '13px',
              letterSpacing: '2px', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              opacity: loading ? 0.7 : 1, marginTop: '8px'
            }}
          >
            <Sparkles size={16} />
            {loading ? 'Creating...' : 'Begin Story'}
          </button>
        </div>
      </div>
    </div>
  )
}