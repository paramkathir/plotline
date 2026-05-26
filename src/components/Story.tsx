import { useEffect, useState, useRef } from 'react'
import { supabase } from '../supabase'
import { Screen, StoryConfig } from '../App'
import { ArrowLeft, Loader } from 'lucide-react'

interface Scene {
  id?: string
  content: string
  choices: string[]
  chosen_index?: number
  scene_number: number
}

export default function Story({ setScreen, config }: {
  setScreen: (s: Screen) => void
  config: StoryConfig
}) {
  const [scenes, setScenes]   = useState<Scene[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const bottomRef             = useRef<HTMLDivElement>(null)
  const initializedRef        = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true
    loadOrStart()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [scenes])

  async function loadOrStart() {
    if (!config.id) { generateScene([]); return }

    const { data } = await supabase
      .from('scenes')
      .select('*')
      .eq('story_id', config.id)
      .order('scene_number', { ascending: true })

    if (data && data.length > 0) {
      const loaded = data.map(s => ({
        id: s.id,
        content: s.content,
        choices: s.choices || [],
        chosen_index: s.chosen_index,
        scene_number: s.scene_number
      }))
      setScenes(loaded)
    } else {
      generateScene([])
    }
  }

  async function generateScene(history: Scene[], choiceText?: string) {
    setLoading(true)
    setError('')

    const historyPayload = history.map(s => ({
      content: s.content,
      chosen: s.chosen_index !== undefined ? s.choices[s.chosen_index] : undefined
    }))

    try {
      const res = await fetch('http://localhost:8000/scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre: config.genre,
          protagonist: config.protagonist,
          world: config.world,
          tone: config.tone,
          history: historyPayload,
          choice: choiceText || null
        })
      })

      setLoading(false)
      const parsed = await res.json()

      const newScene: Scene = {
        content: parsed.content,
        choices: parsed.choices,
        scene_number: history.length + 1
      }

      if (config.id) {
        const { data } = await supabase.from('scenes').insert({
          story_id: config.id,
          content: newScene.content,
          choices: newScene.choices,
          scene_number: newScene.scene_number
        }).select().single()
        if (data) newScene.id = data.id
      }

      setScenes(prev => [...prev, newScene])

    } catch (e) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  async function handleChoice(sceneIndex: number, choiceIndex: number) {
    const scene = scenes[sceneIndex]
    if (scene.chosen_index !== undefined) return

    const updated = scenes.map((s, i) =>
      i === sceneIndex ? { ...s, chosen_index: choiceIndex } : s
    )
    setScenes(updated)

    if (scene.id) {
      await supabase.from('scenes').update({ chosen_index: choiceIndex }).eq('id', scene.id)
    }

    generateScene(updated, scene.choices[choiceIndex])
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#080b12',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>

      <div style={{
        width: '100%', borderBottom: '1px solid #0f1420',
        padding: '16px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0,
        background: '#080b12', zIndex: 10
      }}>
        <button
          onClick={() => setScreen('mystories')}
          style={{ background: 'none', border: 'none', color: '#444', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#444')}
        >
          <ArrowLeft size={14} /> My Stories
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#fff', fontFamily: 'Georgia, serif' }}>{config.title}</div>
          <div style={{ fontSize: '11px', color: '#444', letterSpacing: '1px', fontFamily: 'Segoe UI, sans-serif' }}>
            {config.genre} · Scene {scenes.length}
          </div>
        </div>
        <div style={{ width: '80px' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '680px', padding: '48px 24px' }}>

        {scenes.map((scene, si) => (
          <div key={si} style={{ marginBottom: '48px' }}>

            <div style={{
              fontSize: '10px', letterSpacing: '3px', color: '#2a2d3a',
              textTransform: 'uppercase', marginBottom: '24px',
              fontFamily: 'Segoe UI, sans-serif'
            }}>
              Scene {scene.scene_number}
            </div>

            <div style={{
              fontSize: '17px', lineHeight: '1.9', color: '#c8c8c8',
              fontFamily: 'Georgia, serif', marginBottom: '36px',
              whiteSpace: 'pre-wrap'
            }}>
              {scene.content}
            </div>

            {scene.choices.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {scene.choices.map((choice, ci) => {
                  const isChosen = scene.chosen_index === ci
                  const isNotChosen = scene.chosen_index !== undefined && !isChosen
                  return (
                    <button
                      key={ci}
                      onClick={() => handleChoice(si, ci)}
                      disabled={scene.chosen_index !== undefined}
                      style={{
                        background: isChosen ? 'rgba(99,102,241,0.15)' : 'transparent',
                        border: `1px solid ${isChosen ? '#6366f1' : isNotChosen ? '#1a1d27' : '#2a2d3a'}`,
                        borderRadius: '4px', padding: '14px 20px',
                        color: isChosen ? '#6366f1' : isNotChosen ? '#2a2d3a' : '#888',
                        fontSize: '14px', textAlign: 'left', fontFamily: 'Georgia, serif',
                        fontStyle: 'italic', transition: 'all 0.2s',
                        cursor: scene.chosen_index !== undefined ? 'default' : 'pointer'
                      }}
                      onMouseEnter={e => {
                        if (scene.chosen_index === undefined)
                          e.currentTarget.style.borderColor = '#6366f1'
                      }}
                      onMouseLeave={e => {
                        if (scene.chosen_index === undefined)
                          e.currentTarget.style.borderColor = '#2a2d3a'
                      }}
                    >
                      {ci + 1}. {choice}
                    </button>
                  )
                })}
              </div>
            )}

            {si < scenes.length - 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                margin: '48px 0 0'
              }}>
                <div style={{ flex: 1, height: '1px', background: '#0f1420' }} />
                <div style={{ color: '#1e2235', fontSize: '16px' }}>*</div>
                <div style={{ flex: 1, height: '1px', background: '#0f1420' }} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            color: '#333', fontSize: '13px', fontFamily: 'Georgia, serif',
            fontStyle: 'italic'
          }}>
            <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
            The story continues...
          </div>
        )}

        {error && (
          <div style={{ color: '#f87171', fontSize: '13px', fontFamily: 'Segoe UI, sans-serif' }}>
            {error}
            <button
              onClick={() => generateScene(scenes)}
              style={{ marginLeft: '12px', color: '#6366f1', background: 'none', border: 'none', fontSize: '13px', cursor: 'pointer' }}
            >
              Try again
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}