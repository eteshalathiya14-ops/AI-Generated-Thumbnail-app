import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SoftBackdrop from '../components/SoftBackdrop'
import AspectRatioSelector from '../components/AspectRatioSelector'
import StyleSelector from '../components/StyleSelector'   
import ColorSchemaSelector from '../components/ColorSchemaSelctor'
import PreviewPanel from '../components/PreviewPanel'

const Generate = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [style, setStyle] = useState('Bold & Graphic')
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false)
  const [colorSchemaId, setColorSchemaId] = useState("vibrant")

  // Get token from localStorage (adjust based on your auth)
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!token) {
      setError('Please log in to generate thumbnails');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:6000/api/thumbnails/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          aspectRatio,
          style,
          colorScheme: colorSchemaId,
          additionalPrompt: additionalDetails.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle structured errors
        if (data.type === 'billing') {
          setMessage(data.solution || 'Switched to free AI service');
        } else if (data.type === 'rate_limit') {
          setError(data.solution || 'Rate limited. Please wait.');
        } else if (data.type === 'service_unavailable') {
          setError(data.solution || 'AI service busy. Try again.');
        } else {
          setError(data.error || 'Generation failed');
        }
        return;
      }

      // Success
      setThumbnail(data.thumbnail);
      setMessage('Thumbnail generated successfully!');
      // Optionally navigate to preview
      // navigate(`/preview/${data.thumbnail.id}`);

    } catch (err) {
      setError('Network error. Please check if backend is running.');
      console.error('Generate error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SoftBackdrop />

      <div className='pt-24 min-h-screen'>
        <main className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid lg:grid-cols-[400px_1fr] gap-8'>

            {/* LEFT PANEL */}
            <div className='space-y-6 lg:h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2'>

              <div className='p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6'>

                <div>
                  <h2 className='text-xl font-bold text-zinc-100'>Create Your Thumbnail</h2>
                  <p className='text-sm text-zinc-100 mb-1'>
                    Describe your vision and let AI bring it to life
                  </p>
                </div>

                {/* Title */}
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>Title or Topic</label>
                  <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    placeholder='e.g. 10 Tips for Better Sleep'
                    className='w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                  />
                  <div className='flex justify-end'>
                    <span className='text-xs text-zinc-400'>{title.length}/100</span>
                  </div>
                </div>

                {/* Aspect Ratio */}
                <AspectRatioSelector
                  value={aspectRatio}
                  onChange={setAspectRatio}
                />

                {/* Style */}
                <StyleSelector
                  value={style}
                  onChange={setStyle}
                  isOpen={styleDropdownOpen}
                  setIsOpen={setStyleDropdownOpen}
                />

                {/* Color */}
                <ColorSchemaSelector
                  value={colorSchemaId}
                  onChange={setColorSchemaId}
                />

                {/* Details */}
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>
                    Additional Prompts
                    <span className='text-zinc-400 text-xs'> (optional)</span>
                  </label>
                  <textarea
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    rows={3}
                    placeholder='Add any specific element, mood, or style preferences...'
                    className='w-full px-4 py-3 rounded-lg border border-white/10 bg-white/6 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none'
                  />
                </div>

                {/* Messages */}
                {message && (
                  <div className='p-3 rounded-lg bg-green/20 border border-green/30 text-green-100 text-sm'>
                    {message}
                  </div>
                )}
                {error && (
                  <div className='p-3 rounded-lg bg-red/20 border border-red/30 text-red-100 text-sm'>
                    {error}
                  </div>
                )}

                {/* Button */}
                <button 
                  onClick={handleGenerate} 
                  disabled={loading}
                  className='text-[15px] w-full py-3.5 rounded-xl font-medium bg-gradient-to-b from-cyan-500 to-cyan-900 hover:from-cyan-400 hover:to-cyan-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Generating with AI...' : 'Generate Thumbnail'}
                </button>

              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="h-[500px] lg:h-[calc(100vh-120px)]">
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

