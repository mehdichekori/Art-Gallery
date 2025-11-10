'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtPiece } from '@/types/art';
import { CanvasSize, getCanvasDimensions } from '@/types/settings';

interface ArtDisplayProps {
  artPiece: ArtPiece;
  onClick: (e: React.MouseEvent) => void;
  frameStyle: FrameStyle;
  isExpanded: boolean;
  canvasSize: CanvasSize;
}

export type FrameStyle = 'classic' | 'thin-black' | 'gold' | 'ornate' | 'modern';

export default function ArtDisplay({ artPiece, onClick, frameStyle, isExpanded, canvasSize }: ArtDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get canvas dimensions based on size setting
  const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(canvasSize);

  // Reset image loaded state when art piece changes
  useEffect(() => {
    const resetImageState = () => {
      setImageLoaded(false);
      setImageError(false);
    };
    resetImageState();
  }, [artPiece.objectId]);

  // Smooth frame transition variants
  const frameVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      filter: 'brightness(0.8)',
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'brightness(1)',
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1] as const,
        opacity: { duration: 0.6 },
        scale: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
        filter: { duration: 0.8 }
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: 'brightness(1.1)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const,
        opacity: { duration: 0.4 },
        scale: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
        filter: { duration: 0.5 }
      }
    }
  };

  // Image fade-in variants
  const imageVariants = {
    fadeIn: {
      opacity: 0,
      scale: 1.02,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    },
    fadeOut: {
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  return (
    <div className={`artwork-container ${isExpanded ? 'expanded' : ''}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={artPiece.objectId}
          className="artwork-frame"
          variants={frameVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClick}
          style={{
            width: isExpanded ? 'auto' : `${canvasWidth}px`,
            height: isExpanded ? 'auto' : `${canvasHeight}px`,
          }}
        >
          <motion.div
            className={`frame frame-${frameStyle}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{
              width: isExpanded ? 'auto' : `${canvasWidth}px`,
              height: isExpanded ? 'auto' : `${canvasHeight}px`,
            }}
          >
            <AnimatePresence mode="wait">
              {!imageError ? (
                <motion.img
                  key={artPiece.imageUrl}
                  src={artPiece.imageUrl}
                  alt={`${artPiece.title} by ${artPiece.artist}`}
                  className="artwork-image"
                  variants={imageVariants}
                  initial="fadeIn"
                  animate={imageLoaded ? "visible" : "fadeIn"}
                  exit="fadeOut"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  style={{
                    width: isExpanded ? 'auto' : `${canvasWidth}px`,
                    height: isExpanded ? 'auto' : `${canvasHeight}px`,
                    maxWidth: isExpanded ? '90vw' : '100%',
                    maxHeight: isExpanded ? '75vh' : '100%',
                    objectFit: 'contain' as const,
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)'
                  }}
                />
              ) : (
                <motion.div
                  className="artwork-placeholder"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  style={{
                    width: isExpanded ? 'auto' : `${canvasWidth}px`,
                    height: isExpanded ? 'auto' : `${canvasHeight}px`,
                  }}
                >
                  <p>Image not available</p>
                  <p className="text-sm mt-2">{artPiece.title}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
