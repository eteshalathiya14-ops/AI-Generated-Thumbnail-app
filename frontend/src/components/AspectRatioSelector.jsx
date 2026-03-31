import { RectangleHorizontal, RectangleVertical, Square } from "lucide-react";
import { useState } from "react";

const ratios = [
  { label: "16:9", icon: RectangleHorizontal, hint: "Landscape" },
  { label: "1:1", icon: Square, hint: "Square" },
  { label: "9:16", icon: RectangleVertical, hint: "Portrait" },
];

export default function AspectRatioSelector({ value, onChange }) {
  const [selected, setSelected] = useState(value || "16:9");

  const handleClick = (label) => {
    setSelected(label);
    onChange?.(label);
  };

  return (
    <div className="w-full font-sans">

      {/* Label */}
      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white/40 mb-2.5">
        Aspect Ratio
      </p>

      {/* Buttons */}
      <div className="flex gap-2.5">
        {ratios.map(({ label, icon: Icon, hint }) => {
          const active = selected === label;

          return (
            <button
              key={label}
              onClick={() => handleClick(label)}
              className={`relative flex-1 flex flex-col items-center justify-center gap-1.5 px-2.5 py-3.5 rounded-[14px] 
              border transition-all overflow-hidden
              
              ${
                active
                  ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-400 shadow-[0_0_0_1px_rgba(56,189,248,0.2),0_8px_24px_rgba(56,189,248,0.12)]"
                  : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition 
              bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 rounded-[14px]" />

              {/* Icon */}
              <div
                className={`relative w-10 h-10 rounded-[10px] flex items-center justify-center border transition
                ${
                  active
                    ? "bg-cyan-400/20 border-cyan-400/40 text-cyan-400"
                    : "bg-white/10 border-white/10"
                }`}
              >
                <Icon size={17} />
              </div>

              {/* Label */}
              <span className="text-[13px] font-semibold tracking-[0.03em]">
                {label}
              </span>

              {/* Hint */}
              <span className="text-[10px] uppercase tracking-[0.06em] opacity-60">
                {hint}
              </span>

              {/* Active Bar */}
              {active && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_#38bdf8]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}