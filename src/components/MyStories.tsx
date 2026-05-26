import { useEffect, useState } from 'react'
import { supabase } from '../supabase.ts'
import { Screen, StoryConfig } from '../App.tsx'
import { ArrowLeft, BookOpen, Trash2 } from 'lucide-react'

interface Story {
  id: string
  title: string
  genre: string
  protagonist: string
  world: string
  tone: string
  created_at: string
}

export default function MyStories({ setScreen, setStoryConfig }: {
  setScreen: (s: Screen) => void
  setStoryConfig: (c: StoryConfig) => void
}) {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStories()
  }, [])

  async function fetchStories() {
    const { data } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setStories(data)
    setLoading(false)
  }

  async function deleteStory(id: string) {
    setStories(prev => prev.filter(s => s.id !== id))
    await supabase.from('stories').delete().eq('id', id)
  }

  function resumeStory(story: Story) {
    setStoryConfig({
      id: story.id,
      title: story.title,
      genre: story.genre,
      protagonist: story.protagonist,
      world: story.world,
      tone: story.tone
    })
    setScreen('story')
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#080b12',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '40px 20px'
    }}>
      <div style={{ width: '100%', maxWidth: '640px' }}>

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
            Your Library
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 400, color: '#fff', fontFamily: 'Georgia, serif' }}>
            My Stories
          </h2>
        </div>

        {loading ? (
          <div style={{ color: '#444', fontSize: '14px', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Loading your stories...</div>
        ) : stories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ color: '#333', fontSize: '14px', fontFamily: 'Georgia, serif', fontStyle: 'italic', marginBottom: '24px' }}>
              No stories yet. Begin your first adventure.
            </div>
            <button
              onClick={() => setScreen('setup')}
              style={{
                background: '#6366f1', border: 'none', borderRadius: '4px',
                padding: '12px 24px', color: '#fff', fontSize: '13px',
                letterSpacing: '2px', textTransform: 'uppercase'
              }}
            >
              Begin New Story
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stories.map(story => (
              <div
                key={story.id}
                style={{
                  background: '#0f1420', border: '1px solid #1e2235',
                  borderRadius: '6px', padding: '20px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '16px', color: '#fff', fontFamily: 'Georgia, serif', marginBottom: '6px' }}>
                    {story.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#444', fontFamily: 'Segoe UI, sans-serif', letterSpacing: '1px' }}>
                    {story.genre} · {story.protagonist} · {new Date(story.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => resumeStory(story)}
                    style={{
                      background: 'rgba(99,102,241,0.15)', border: '1px solid #6366f1',
                      borderRadius: '4px', padding: '8px 16px', color: '#6366f1',
                      fontSize: '12px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.25)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.15)')}
                  >
                    <BookOpen size={13} /> Resume
                  </button>
                  <button
                    onClick={() => deleteStory(story.id)}
                    style={{
                      background: 'none', border: '1px solid #1e2235',
                      borderRadius: '4px', padding: '8px', color: '#444',
                      display: 'flex', alignItems: 'center'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2235'; e.currentTarget.style.color = '#444' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}