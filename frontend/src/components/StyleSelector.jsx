import { useState } from "react";
import { Sparkles, Layers, Box, Smile, Film, Zap, ChevronDown } from "lucide-react";

const styles = [
  {
    name: "Bold & Graphic",
    description: "High contrast, bold typography, striking visuals",
    icon: Sparkles,
    accent: "#00d4ff",
  },
  {
    name: "Minimal",
    description: "Clean, simple, lots of white space",
    icon: Layers,
    accent: "#a8edea",
  },
  {
    name: "3D",
    description: "Depth, shadows, realistic elements",
    icon: Box,
    accent: "#7c6ff7",
  },
  {
    name: "Cartoon",
    description: "Fun, colorful, animated style",
    icon: Smile,
    accent: "#ffd166",
  },
  {
    name: "Cinematic",
    description: "Dramatic lighting, movie-like scenes",
    icon: Film,
    accent: "#ef8c8c",
  },
  {
    name: "Neon Glow",
    description: "Bright neon colors, glowing effects",
    icon: Zap,
    accent: "#39ff14",
  },
];

const StyleSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  const selected = styles.find((s) => s.name === value);

  return (
    <div className="w-full"> {/* ✅ width fix */}

      {/* Label */}
      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/40 mb-2.5">
        Style
      </p>

      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-[14px] flex items-center justify-between gap-3 
        bg-white/5 border border-white/10 text-white backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          {selected && (
            <div
              className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center border"
              style={{
                background: `${selected.accent}18`,
                borderColor: `${selected.accent}40`,
                color: selected.accent,
              }}
            >
              <selected.icon size={14} />
            </div>
          )}

          <span className="text-[14px] font-medium text-[#e8eaf0]">
            {value || "Select style"}
          </span>
        </div>

        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""} text-white/40`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="mt-2 rounded-[16px] overflow-hidden border border-white/10 shadow-2xl']">
          {styles.map((style, i) => {
            const Icon = style.icon;
            const isActive = style.name === value;
            const isHov = hovered === i;

            return (
              <div
                key={i}
                onClick={() => {
                  onChange(style.name);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition
                ${i !== styles.length - 1 ? "border-b border-white/5" : ""}
                ${isActive ? "" : "hover:bg-white/5"}`}
                style={{
                  background: isActive ? `${style.accent}0d` : "transparent",
                }}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center border transition-all"
                  style={{
                    color: style.accent,
                    background:
                      isActive || isHov
                        ? `${style.accent}20`
                        : `${style.accent}10`,
                    borderColor: isActive
                      ? `${style.accent}60`
                      : `${style.accent}25`,
                  }}
                >
                  <Icon size={15} />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <p
                    className={`text-[13.5px] leading-tight ${
                      isActive ? "font-semibold" : "font-medium"
                    }`}
                    style={{
                      color: isActive ? style.accent : "#d1d5e0",
                    }}
                  >
                    {style.name}
                  </p>

                  <p className="text-[12px] text-white/40 mt-[2px] leading-snug">
                    {style.description}
                  </p>
                </div>

                {/* Active Dot */}
                {isActive && (
                  <div
                    className="ml-auto w-[7px] h-[7px] rounded-full"
                    style={{
                      background: style.accent,
                      boxShadow: `0 0 8px ${style.accent}`,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StyleSelector;