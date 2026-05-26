import { useEffect, useState } from 'react'
import { supabase } from './supabase.ts'
import Landing from './components/Landing'
import Setup from './components/Setup'
import Story from './components/Story'
import MyStories from './components/MyStories'

export type Screen = 'landing' | 'setup' | 'story' | 'mystories'

export interface StoryConfig {
  id?: string
  title: string
  genre: string
  protagonist: string
  world: string
  tone: string
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [screen, setScreen] = useState<Screen>('landing')
  const [storyConfig, setStoryConfig] = useState<StoryConfig | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        await supabase.auth.signInAnonymously()
      }
      setReady(true)
    }
    init()
  }, [])

  if (!ready) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#080b12', color: '#444', fontSize: '14px',
      fontFamily: 'Georgia, serif', letterSpacing: '2px'
    }}>
      PLOTLINE
    </div>
  )

  return (
    <>
      {screen === 'landing'   && <Landing   setScreen={setScreen} />}
      {screen === 'setup'     && <Setup     setScreen={setScreen} setStoryConfig={setStoryConfig} />}
      {screen === 'mystories' && <MyStories setScreen={setScreen} setStoryConfig={setStoryConfig} />}
      {screen === 'story'     && storyConfig && <Story setScreen={setScreen} config={storyConfig} />}
    </>
  )
}