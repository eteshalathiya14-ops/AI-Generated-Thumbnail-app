import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SoftBackdrop from '../components/SoftBackdrop'
import AspectRatioSelector from '../components/AspectRatioSelector'
import StyleSelector from '../components/StyleSelector'
import ColorSchemaSelector from '../components/ColorSchemaSelctor'
import PreviewPanel from '../components/PreviewPanel'

const BASE_URL = 'http://localhost:5000'

const Generate = () => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [ratioChanged, setRatioChanged] = useState(false) //  new

  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [style, setStyle] = useState('Bold & Graphic')

  const [colorScheme, setColorScheme] = useState({
    id: 'aurora',
    colors: ['#7f5af0', '#2cb67d', '#ff8906']
  })

  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  // Aspect ratio change — clear old thumbnail + show warning
  const handleAspectRatioChange = (newRatio) => {
    setAspectRatio(newRatio)
    setThumbnail(null)       // purani image clear
    setMessage(null)
    setError(null)
    setRatioChanged(true)    // warning dikhao
  }

  const handleColorChange = (val) => {
    if (typeof val === 'string') {
      setColorScheme({ id: val, colors: [] })
    } else {
      setColorScheme({
        id: val?.id || 'aurora',
        colors: val?.colors || []
      })
    }
  }

  const handleGenerate = async () => {
    if (!title.trim()) { setError('Please enter a title'); return }
    if (!token) { setError('Please log in to generate thumbnails'); return }

    setLoading(true)
    setError(null)
    setMessage(null)
    setRatioChanged(false)  // warning hatao jab generate start ho

    try {
      const response = await fetch(`${BASE_URL}/api/thumbnails/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          aspectRatio,
          style,
          colorScheme: colorScheme.id,
          colorHex: colorScheme.colors,
          additionalPrompt: additionalDetails.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.type === 'billing') setMessage(data.solution || 'Switched to free AI service')
        else if (data.type === 'rate_limit') setError(data.solution || 'Rate limited. Please wait.')
        else if (data.type === 'service_unavailable') setError(data.error || 'AI service busy. Try again.')
        else setError(data.error || 'Generation failed')
        return
      }

      setThumbnail(data.thumbnail.imageUrl)
      setMessage('Thumbnail generated successfully!')

    } catch (err) {
      setError('Network error. Please check if backend is running.')
      console.error('Generate error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SoftBackdrop />
      <div className='pt-24 min-h-screen'>
        <main className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid lg:grid-cols-[400px_1fr] gap-8'>

            {/* LEFT PANEL */}
            <div className='space-y-6 lg:h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2'>
              <div className='p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl space-y-6'>

                <div>
                  <h2 className='text-xl font-bold text-zinc-100'>Create Your Thumbnail</h2>
                  <p className='text-sm text-zinc-400 mb-1'>Describe your vision and let AI bring it to life</p>
                </div>

                {/* Title */}
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-zinc-300'>Title or Topic</label>
                  <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    maxLength={100}
                    placeholder='e.g. 10 Tips for Better Sleep'
                    className='w-full px-4 py-3 rounded-xl border border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 transition'
                  />
                  <div className='flex justify-end'>
                    <span className='text-xs text-zinc-500'>{title.length}/100</span>
                  </div>
                </div>

                {/* handleAspectRatioChange use karo */}
                <AspectRatioSelector value={aspectRatio} onChange={handleAspectRatioChange} />
                <StyleSelector value={style} onChange={setStyle} />
                <ColorSchemaSelector value={colorScheme.id} onChange={handleColorChange} />

                {/* Additional Prompt */}
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-zinc-300'>
                    Additional Prompts
                    <span className='text-zinc-500 text-xs ml-1'>(optional)</span>
                  </label>
                  <textarea
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    rows={3}
                    placeholder='Add any specific element, mood, or style preferences...'
                    className='w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 resize-none transition'
                  />
                </div>

                {/* Messages */}
                {message && (
                  <div className='p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm'>
                    {message}
                  </div>
                )}
                {error && (
                  <div className='p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm'>
                    {error}
                  </div>
                )}

                {/*  Aspect ratio changed warning */}
                {ratioChanged && !loading && (
                  <div className='p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm flex items-center gap-2'>
                     Aspect ratio changed — click Generate for new image
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className='w-full py-3.5 rounded-xl font-semibold text-[15px] text-white bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 active:scale-[0.98]'
                >
                  {loading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24' fill='none'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/>
                      </svg>
                      Generating with AI...
                    </span>
                  ) : (ratioChanged ? '🔄 Regenerate for New Ratio' : '✨ Generate Thumbnail')}
                </button>

              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className='h-[500px] lg:h-[calc(100vh-120px)]'>
              <PreviewPanel
                thumbnail={thumbnail}
                loading={loading}
                aspectRatio={aspectRatio}
              />
            </div>

          </div>
        </main>
      </div>
    </>
  )
}

export default Generate