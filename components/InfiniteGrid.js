import React, { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
} from "framer-motion";
import { Settings2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function GridPattern({ offsetX, offsetY, size }) {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="grid-pattern"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-zinc-400 dark:text-zinc-600"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
}

export default function InfiniteGrid({ children }) {
  const [gridSize, setGridSize] = useState(40);
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.5;
  const speedY = 0.5;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % gridSize);
    gridOffsetY.set((currentY + speedY) % gridSize);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "fixed inset-0 z-[-1] flex flex-col items-center justify-center overflow-hidden bg-[#f4f6f5] dark:bg-[#0a0e1a]"
      )}
    >
      <div className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.08]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} size={gridSize} />
      </div>

      <motion.div
        className="absolute inset-0 z-0 opacity-30 dark:opacity-40"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} size={gridSize} />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-orange-500/30 dark:bg-orange-600/20 blur-[120px]" />
        <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-blue-500/30 dark:bg-blue-600/20 blur-[120px]" />
      </div>

      <div className="absolute bottom-10 right-4 z-30 pointer-events-auto">
        <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl shadow-2xl space-y-2 min-w-[160px]">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <Settings2 className="w-3.5 h-3.5" />
            Grid Density
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[9px] text-zinc-500 dark:text-zinc-500 uppercase tracking-widest font-mono">
            <span>Dense</span>
            <span>({gridSize}px)</span>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
