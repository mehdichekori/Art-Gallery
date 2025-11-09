'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArtPiece } from '@/types/art';

interface ArtDisplayProps {
  artPiece: ArtPiece;
  onClick: () => void;
  frameStyle: FrameStyle;
  isExpanded: boolean;
}

export type FrameStyle = 'classic' | 'thin-black' | 'gold' | 'ornate' | 'modern';

export default function ArtDisplay({ artPiece, onClick, frameStyle, isExpanded }: ArtDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="artwork-container">
      <motion.div
        className="artwork-frame"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          scale: isExpanded ? 0.75 : 1
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        onClick={onClick}
      >
        <div className={`frame frame-${frameStyle}`}>
          {!imageError ? (
            <img
              src={artPiece.imageUrl}
              alt={`${artPiece.title} by ${artPiece.artist}`}
              className={`artwork-image ${imageLoaded ? 'loaded' : ''}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="artwork-placeholder">
              <p>Image not available</p>
              <p className="text-sm mt-2">{artPiece.title}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
