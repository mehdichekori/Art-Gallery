'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtPiece } from '@/types/art';

interface ArtDisplayProps {
  artPiece: ArtPiece;
  onClick: () => void;
  frameStyle: FrameStyle;
  isExpanded: boolean;
  isTransitioning?: boolean;
}

export type FrameStyle = 'classic' | 'thin-black' | 'gold' | 'ornate' | 'modern';

export default function ArtDisplay({ artPiece, onClick, frameStyle, isExpanded, isTransitioning }: ArtDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset image loaded state when art piece changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
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
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 0.6 },
        scale: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
        filter: { duration: 0.8 }
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: 'brightness(1.1)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 0.4 },
        scale: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
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
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    fadeOut: {
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
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
        >
          <motion.div
            className={`frame frame-${frameStyle}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
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
