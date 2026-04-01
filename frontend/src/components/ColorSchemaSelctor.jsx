import React, { useState } from "react";

const colorSchemes = [
  { id: "aurora", name: "Aurora", colors: ["#7f5af0", "#2cb67d", "#ff8906"] },
  { id: "sunset", name: "Sunset", colors: ["#f72585", "#f4a261", "#ffd166"] },
  { id: "ocean", name: "Ocean", colors: ["#0077b6", "#00b4d8", "#90e0ef"] },
  { id: "midnight", name: "Midnight", colors: ["#1a1a2e", "#16213e", "#533483"] },
  { id: "sakura", name: "Sakura", colors: ["#ffb7c5", "#ff70a6", "#d4a5a5"] },
  { id: "forest", name: "Forest", colors: ["#1b4332", "#52b788", "#d8f3dc"] },
  { id: "volcano", name: "Volcano", colors: ["#dc2f02", "#e85d04", "#faa307"] },
  { id: "mist", name: "Mist", colors: ["#e9ecef", "#adb5bd", "#6c757d"] },
];

const ColorSchemaSelector = ({ value = "aurora", onChange }) => {
  const [hovered, setHovered] = useState(null);
  const [activePreset, setActivePreset] = useState("aurora");
  const [isCustom, setIsCustom] = useState(false);
  const [customColors, setCustomColors] = useState(["#7f5af0", "#2cb67d", "#ff8906"]);

  const activeColors = isCustom
    ? customColors
    : (colorSchemes.find((s) => s.id === activePreset)?.colors ?? customColors);

  const activeName = isCustom
    ? "Custom"
    : colorSchemes.find((s) => s.id === activePreset)?.name;

  const handlePresetClick = (scheme) => {
    setActivePreset(scheme.id);
    setIsCustom(false);
    setCustomColors([...scheme.colors]);
    onChange?.(scheme.id);
  };

  const handleCustomColor = (index, color) => {
    const updated = [...customColors];
    updated[index] = color;
    setCustomColors(updated);
    setIsCustom(true);
    // Skip object for backend string enum
  };

  return (
    <div className="flex flex-col gap-2.5">

      {/* Label */}
      <label className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/30">
        Color Scheme
      </label>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {colorSchemes.map((scheme) => {
          const isOn = !isCustom && activePreset === scheme.id;
          const isHov = hovered === scheme.id;

          return (
            <button
              key={scheme.id}
              onClick={() => handlePresetClick(scheme)}
              onMouseEnter={() => setHovered(scheme.id)}
              onMouseLeave={() => setHovered(null)}
              className={`relative h-10 rounded-[10px] overflow-hidden p-0 cursor-pointer transition-all
              ${isOn ? "border-2 border-white/85 -translate-y-[2px]" : "border-2 border-white/10"}
              ${isHov ? "-translate-y-[2px]" : ""}`}
            >
              <div className="flex h-full">
                {scheme.colors.map((c, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>

              {isOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <svg width="13" height="13" viewBox="0 0 20 20">
                    <polyline
                      points="4,10 8,14 16,6"
                      stroke="white"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              <div className="absolute bottom-[3px] left-0 right-0 text-center text-[7px] font-bold tracking-[0.05em] uppercase text-white/70 pointer-events-none">
                {scheme.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-[2px]" />

      {/* Custom label */}
      <label className="text-[10px] font-bold tracking-[0.1em] uppercase text-white/30">
        Custom — tap to pick your own
      </label>

      {/* Pickers */}
      <div className="flex gap-2">
        {[0, 1, 2].map((idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">

            <span className="text-[9px] font-bold text-white/40 tracking-[0.06em] uppercase">
              Color {idx + 1}
            </span>

            <div className={`relative w-full h-11 rounded-[10px] overflow-hidden cursor-pointer transition-all
              ${isCustom ? "border-2 border-white/40" : "border-2 border-white/10"}`}
            >
              <div className="absolute inset-0" style={{ backgroundColor: activeColors[idx] }} />

              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <svg width="16" height="16" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" fill="none" />
                  <line x1="10" y1="6" x2="10" y2="14" stroke="white" strokeWidth="1.5" />
                  <line x1="6" y1="10" x2="14" y2="10" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>

              <input
                type="color"
                value={activeColors[idx]}
                onChange={(e) => handleCustomColor(idx, e.target.value)}
                className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] opacity-0 cursor-pointer"
              />
            </div>

            <span className="text-[8px] font-bold px-2 py-[2px] rounded bg-white/10 text-white/50 font-mono">
              {activeColors[idx]}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs font-bold text-white/60">
          {activeName}
        </span>

        <div className="flex gap-1">
          {activeColors.map((c, i) => (
            <span key={i} className="text-[8px] font-bold px-2 py-[2px] rounded bg-white/10 text-white/50 font-mono">
              {c}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ColorSchemaSelector;