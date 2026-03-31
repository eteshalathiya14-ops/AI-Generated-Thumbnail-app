import React, { useEffect, useState } from 'react'
import SoftBackdrop from '../components/SoftBackdrop'
import { ArrowUpRightIcon, DownloadIcon, Link, TrashIcon } from 'lucide-react'

const MyGeneration = () => {

  const aspectRatioClassMap = {
    '16:9': 'aspect-video',
    '1:1':  'aspect-square',
    '9:16': 'aspect-[9/16]',
  }

  const [thumbnails, setThumbnail] = useState([ {
    _id: '1',
    title: 'Top 10 React Tips',
    image_url: 'https://picsum.photos/seed/1/400/225',
    aspectRatio: '16:9',
    style: 'Bold & Graphic',
    color_scheme: 'Vibrant',
    aspect_ratio: '16:9',
    isGenerating: false,
    createdAt: new Date(),
  },
  {
    _id: '2',
    title: 'How to Learn JavaScript Fast',
    image_url: 'https://picsum.photos/seed/2/400/225',
    aspectRatio: '1:1',
    style: 'Minimal',
    color_scheme: 'Ocean',
    aspect_ratio: '1:1',
    isGenerating: false,
    createdAt: new Date(),
  },
  {
    _id: '3',
    title: 'AI Tools 2025',
    image_url: '',
    aspectRatio: '9:16',
    style: 'Cinematic',
    color_scheme: 'Midnight',
    aspect_ratio: '9:16',
    isGenerating: true,
    createdAt: new Date(),
  },])
  const [loading, setLoading] = useState(false)

  const fetchThumbnail = async () => {
    setLoading(false)
  }

  const handleDownload = (image_url) => {
    window.open(image_url, '_blank')
  }

  const handelDelted = async (id) => {
    console.log(id)
  }

  useEffect(() => {
    fetchThumbnail()
  }, [])

  return (
    <>
      <SoftBackdrop />
      <div className='mt-36 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-zinc-200'>My Generation</h1>
          <p className='text-sm mt-1 text-zinc-400'>view and manage all your AI-generated thumbnails</p>
        </div>

        {loading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='rounded-2xl bg-white/6 border border-white/10 animate-pulse h-[260px]' />
            ))}
          </div>
        )}

        {!loading && thumbnails.length === 0 && (
          <div className='text-center py-24'>
            <h3 className='text-lg font-semibold text-zinc-200'>No thumbnails yet</h3>
            <p className='text-sm text-zinc-400 mt-2'>Generate your first thumbnail to see it here</p>
          </div>
        )}

        {!loading && thumbnails.length > 0 && (
          <div className='columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-8'>
            {thumbnails.map((thumbnail, i) => {
              const aspectClass = aspectRatioClassMap[thumbnail.aspectRatio] || 'aspect-video'
              return (
                <div key={i} className='group relative mb-8 rounded-2xl overflow-hidden border border-white/10 bg-white/5'>
                  
                  {/* Image with aspect ratio */}
                  <div className={`relative w-full ${aspectClass}`}>
                    {thumbnail.image_url ? (
                      <img src={thumbnail.image_url} alt={thumbnail.title} className='w-full h-full object-cover' />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-sm text-zinc-400'>
                        {thumbnail.isGenerating ? 'Generating...' : 'No image'}
                      </div>
                    )}

                    {thumbnail.isGenerating && (
                      <div className='absolute inset-0 bg-black/50 flex items-center justify-center text-sm font-medium text-white'>
                        Generating...
                      </div>
                    )}

                    {/* Action Buttons - image ke upar */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className='absolute bottom-2 right-2 flex sm:hidden group-hover:flex gap-1.5'
                    >
                      <TrashIcon
                        onClick={() => handelDelted(thumbnail._id)}
                        className='size-7 bg-black/60 p-1.5 rounded-lg hover:bg-cyan-600 transition-all cursor-pointer text-white'
                      />
                      <DownloadIcon
                        onClick={() => handleDownload(thumbnail.image_url)}
                        className='size-7 bg-black/60 p-1.5 rounded-lg hover:bg-cyan-600 transition-all cursor-pointer text-white'
                      />
                      {/* Link fix - use anchor tag */}
                      <a
                        href={`/preview?thumbnail_url=${thumbnail.image_url}&title=${thumbnail.title}`}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <ArrowUpRightIcon className='size-7 bg-black/60 p-1.5 rounded-lg hover:bg-cyan-600 transition-all cursor-pointer text-white' />
                      </a>
                    </div>
                  </div>

                  {/* Info - card ke neeche, bahar */}
                  <div className='p-3 space-y-2'>
                    <h3 className='text-sm font-semibold text-zinc-100 line-clamp-2'>{thumbnail.title}</h3>
                    <div className='flex flex-wrap gap-2 text-xs text-zinc-400'>
                      <span className='px-2 py-0.5 rounded-md bg-white/8 border border-white/10'>{thumbnail.style}</span>
                      <span className='px-2 py-0.5 rounded-md bg-white/8 border border-white/10'>{thumbnail.color_scheme}</span>
                      <span className='px-2 py-0.5 rounded-md bg-white/8 border border-white/10'>{thumbnail.aspect_ratio}</span>
                    </div>
                    <p className='text-xs text-zinc-500'>{new Date(thumbnail.createdAt).toLocaleDateString()}</p>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default MyGeneration