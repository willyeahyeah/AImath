// Scene Player component - renders and animates lesson scenes
'use client';

import React, { useState, useEffect } from 'react';
import { LessonScene, NarrationSegment } from '@/types';
import { VisualMathEngine, RenderContext } from '@/lib/visual-math-engine';

interface ScenePlayerProps {
  scene: LessonScene;
  onComplete?: () => void;
  reducedMotion?: boolean;
}

export function ScenePlayer({ scene, onComplete, reducedMotion = false }: ScenePlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentNarration, setCurrentNarration] = useState<NarrationSegment | null>(null);

  useEffect(() => {
    if (!isPlaying) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setCurrentTime(elapsed);

      // Find current narration
      const narration = scene.narration.find(
        n => elapsed >= n.tStartMs && elapsed <= n.tEndMs
      );
      setCurrentNarration(narration || null);

      // Check if scene is complete
      if (elapsed >= scene.durationMs) {
        setIsPlaying(false);
        onComplete?.();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, scene, onComplete]);

  const ctx: RenderContext = {
    currentTimeMs: currentTime,
    reducedMotion,
  };

  const elements = VisualMathEngine.renderScene(scene, ctx);

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const replay = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className="scene-player w-full max-w-md mx-auto">
      {/* SVG Canvas */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <svg
          width="100%"
          height="400"
          viewBox="0 0 360 400"
          className="w-full"
          style={{ maxHeight: '400px' }}
        >
          {elements}
        </svg>
      </div>

      {/* Subtitle Display */}
      {currentNarration && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4 text-center min-h-[80px] flex items-center justify-center">
          <p className="text-lg font-medium text-gray-900">
            {currentNarration.subtitleTc}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={togglePlayPause}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          {isPlaying ? '暫停' : '播放'}
        </button>
        <button
          onClick={replay}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
        >
          重播
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-4 bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${(currentTime / scene.durationMs) * 100}%` }}
        />
      </div>
    </div>
  );
}
