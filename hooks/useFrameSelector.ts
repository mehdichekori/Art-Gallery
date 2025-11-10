import { useState, useEffect } from 'react';
import { FrameStyle } from '@/components/ArtDisplay';

const FRAME_STYLES: FrameStyle[] = ['classic', 'thin-black', 'gold', 'ornate', 'modern'];

export function useFrameSelector() {
  const [currentFrame, setCurrentFrame] = useState<FrameStyle>('classic');

  const selectRandomFrame = () => {
    const randomIndex = Math.floor(Math.random() * FRAME_STYLES.length);
    setCurrentFrame(FRAME_STYLES[randomIndex]);
  };

  useEffect(() => {
    // Select a random frame on mount
    selectRandomFrame();
  }, []);

  return {
    currentFrame,
    selectRandomFrame,
  };
}
