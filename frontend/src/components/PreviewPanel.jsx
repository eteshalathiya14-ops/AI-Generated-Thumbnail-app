import React from 'react'
import { Sparkles } from 'lucide-react'

const PreviewPanel = ({ thumbnail, loading, aspectRatio = "16:9" }) => {

  const frameConfig = {
    "16:9": "max-w-full aspect-video",
    "1:1": "max-w-[70%] aspect-square",
    "9:16": "max-w-[42%] aspect-[9/16]",
  }

  const frameClass = frameConfig[aspectRatio] || frameConfig["16:9"]

  return (
    <div className="flex flex-col h-full mt-3">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Preview
        </h2>

        <span className="text-[11px] font-semibold px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/50 tracking-wider">
          {aspectRatio}
        </span>
      </div>

      {/* Outer Gradient Border */}
      <div className="flex-1 rounded-[18px] p-[1px] bg-gradient-to-br from-white/10 to-white/5">

        {/* Inner Container */}
        <div className="w-full h-full rounded-[17px] flex items-center justify-center p-6 bg-gradient-to-br from-[#0d1b2e] via-[#091422] to-[#060d18]">

          {/* Frame */}
          <div
            className={`relative w-full ${frameClass} rounded-xl overflow-hidden border border-dashed border-white/20 bg-gradient-to-br from-[#0e1e36] to-[#081224] transition-all duration-300`}
          >

            {/* Corner Borders */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/40 rounded-tl-md" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/40 rounded-tr-md" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/40 rounded-bl-md" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/40 rounded-br-md" />

            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.05),transparent_70%)]" />

            {/* Loading */}
            {loading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <p className="text-sm text-white/50 tracking-wide">
                  Generating...
                </p>
              </div>
            )}

            {/* Image */}
            {thumbnail && !loading && (
              <img
                src={thumbnail}
                alt="preview"
                className="absolute inset-0 w-full h-full object-cover z-10"
              />
            )}

            {/* Empty State */}
            {!thumbnail && !loading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">

                <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center bg-white/10 border border-white/10 shadow-lg">
                  <Sparkles size={26} className="text-white/70" />
                </div>

                <p className="text-white text-lg font-semibold">
                  Your preview will appear here
                </p>

                <p className="text-sm text-white/40 mt-1">
                  Generate a thumbnail to see magic ✦
                </p>

              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  )
}

export default PreviewPanel