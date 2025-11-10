'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArtPiece } from '@/types/art';
import { useSettings } from '@/hooks/useSettings';

interface MetadataLabelProps {
  artPiece: ArtPiece;
}

export default function MetadataLabel({ artPiece }: MetadataLabelProps) {
  const { showDetailsBeforeClick } = useSettings();

  // Don't render if showDetailsBeforeClick is false
  if (!showDetailsBeforeClick) {
    return null;
  }

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(4px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 0.5 },
        y: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
        filter: { duration: 0.6 }
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      filter: 'blur(2px)',
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 0.3 },
        y: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
        filter: { duration: 0.4 }
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }),
    exit: {
      opacity: 0,
      y: -4,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <motion.div
      className="metadata-label"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.p className="artwork-title" variants={itemVariants} custom={0}>
        {artPiece.title}
      </motion.p>
      <motion.p className="artwork-artist" variants={itemVariants} custom={1}>
        {artPiece.artist}
      </motion.p>
      <motion.p className="artwork-year-medium" variants={itemVariants} custom={2}>
        {artPiece.year} • {artPiece.medium}
      </motion.p>
      <motion.p className="artwork-museum" variants={itemVariants} custom={3}>
        {artPiece.museum}
      </motion.p>
    </motion.div>
  );
}
