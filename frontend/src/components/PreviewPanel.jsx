import React from 'react'
import { Sparkles } from 'lucide-react'

const PreviewPanel = ({ thumbnail, loading, aspectRatio = "16:9" }) => {

  // Inline styles — Tailwind custom aspect classes kaam nahi karti
  const getFrameStyle = () => {
    switch (aspectRatio) {
      case "1:1":
        return {
          width: "60%",
          aspectRatio: "1 / 1",
          margin: "0 auto",
        }
      case "9:16":
        return {
          width: "28%",
          aspectRatio: "9 / 16",
          margin: "0 auto",
        }
      case "16:9":
      default:
        return {
          width: "100%",
          aspectRatio: "16 / 9",
        }
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Preview</h2>
        <span className="text-[11px] px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/50">
          {aspectRatio}
        </span>
      </div>

      {/* Card */}
      <div
        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
        className="rounded-2xl bg-[#080f1a] border border-white/8 p-6"
      >

        {/* Frame with correct aspect ratio */}
        <div
          style={{
            ...getFrameStyle(),
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "#0d1b2e",
            flexShrink: 0,
          }}
        >
          {/* Corner accents */}
          <div style={{ position:"absolute", top:0, left:0, width:20, height:20, borderTop:"2px solid rgba(34,211,238,0.5)", borderLeft:"2px solid rgba(34,211,238,0.5)", borderRadius:"8px 0 0 0", zIndex:20 }} />
          <div style={{ position:"absolute", top:0, right:0, width:20, height:20, borderTop:"2px solid rgba(34,211,238,0.5)", borderRight:"2px solid rgba(34,211,238,0.5)", borderRadius:"0 8px 0 0", zIndex:20 }} />
          <div style={{ position:"absolute", bottom:0, left:0, width:20, height:20, borderBottom:"2px solid rgba(34,211,238,0.5)", borderLeft:"2px solid rgba(34,211,238,0.5)", borderRadius:"0 0 0 8px", zIndex:20 }} />
          <div style={{ position:"absolute", bottom:0, right:0, width:20, height:20, borderBottom:"2px solid rgba(34,211,238,0.5)", borderRight:"2px solid rgba(34,211,238,0.5)", borderRadius:"0 0 8px 0", zIndex:20 }} />

          {/* Loading */}
          {loading && (
            <div style={{ position:"absolute", inset:0, zIndex:30, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, backgroundColor:"#0d1b2e" }}>
              <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <p className="text-sm text-white/50">Generating...</p>
            </div>
          )}

          {/* Image */}
          {thumbnail && !loading && (
            <img
              src={thumbnail}
              alt="Generated thumbnail"
              style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:10 }}
            />
          )}

          {/* Empty state */}
          {!thumbnail && !loading && (
            <div style={{ position:"absolute", inset:0, zIndex:10, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"16px", border:"1px dashed rgba(255,255,255,0.1)", borderRadius:"12px" }}>
              <div className="w-12 h-12 rounded-2xl mb-3 flex items-center justify-center bg-white/5 border border-white/10">
                <Sparkles size={20} className="text-white/40" />
              </div>
              <p className="text-white/70 text-sm font-semibold">Your preview will appear here</p>
              <p className="text-xs text-white/30 mt-1">Generate a thumbnail to see magic ✦</p>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}

export default PreviewPanel