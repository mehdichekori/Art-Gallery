'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtPiece } from '@/types/art';

interface ExpandedInfoProps {
  artPiece: ArtPiece | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExpandedInfo({ artPiece, isOpen, onClose }: ExpandedInfoProps) {
  if (!artPiece || !isOpen) return null;

  const panelVariants = {
    hidden: {
      opacity: 0,
      x: 30,
      filter: 'blur(6px)',
      scale: 0.98
    },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 0.4 },
        x: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        filter: { duration: 0.6 },
        scale: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      filter: 'blur(4px)',
      scale: 0.99,
      transition: {
        duration: 0.35,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 0.25 },
        x: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
        filter: { duration: 0.35 }
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
        delay: i * 0.03
      }
    })
  };

  return (
    <motion.div
      className="museum-info-panel-inline"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="museum-panel-content">
        <div className="museum-panel-header">
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <motion.div className="museum-panel-details" variants={contentVariants} initial="hidden" animate="visible">
          <motion.h2 className="museum-title" variants={itemVariants}>
            {artPiece.title}
          </motion.h2>
          <motion.h3 className="museum-artist" variants={itemVariants}>
            {artPiece.artist}
          </motion.h3>

          <motion.div className="museum-metadata-section" variants={itemVariants}>
            <div className="metadata-row">
              <span className="museum-metadata-label">Date</span>
              <span className="museum-metadata-value">{artPiece.year}</span>
            </div>
            <div className="metadata-row">
              <span className="museum-metadata-label">Medium</span>
              <span className="museum-metadata-value">{artPiece.medium}</span>
            </div>
            {artPiece.dimensions && (
              <div className="metadata-row">
                <span className="museum-metadata-label">Dimensions</span>
                <span className="museum-metadata-value">{artPiece.dimensions}</span>
              </div>
            )}
            {artPiece.culture && (
              <div className="metadata-row">
                <span className="museum-metadata-label">Culture</span>
                <span className="museum-metadata-value">{artPiece.culture}</span>
              </div>
            )}
            {artPiece.classification && (
              <div className="metadata-row">
                <span className="museum-metadata-label">Classification</span>
                <span className="museum-metadata-value">{artPiece.classification}</span>
              </div>
            )}
            {/* {artPiece.department && (
              <div className="metadata-row">
                <span className="museum-metadata-label">Department</span>
                <span className="museum-metadata-value">{artPiece.department}</span>
              </div>
            )} */}
          </motion.div>

          {artPiece.creditLine && (
            <motion.div className="museum-credit-line" variants={itemVariants}>
              <p>{artPiece.creditLine}</p>
            </motion.div>
          )}

          {artPiece.description && (
            <motion.div className="museum-description" variants={itemVariants}>
              <p>{artPiece.description}</p>
            </motion.div>
          )}

          {artPiece.tags && artPiece.tags.length > 0 && (
            <motion.div className="museum-tags" variants={itemVariants}>
              {artPiece.tags.map((tag, index) => (
                <motion.span
                  key={index}
                  className="museum-tag"
                  variants={tagVariants}
                  custom={index}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          )}

          <motion.div className="museum-links" variants={itemVariants}>
            {artPiece.objectUrl && (
              <motion.a
                href={artPiece.objectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="museum-link-button"
                whileHover={{ scale: 1.02, backgroundColor: '#2a2a2a' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                View on Museum Website
              </motion.a>
            )}
            {artPiece.wikiUrl && (
              <motion.a
                href={artPiece.wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="museum-link-button secondary"
                whileHover={{ scale: 1.02, backgroundColor: '#e8e8e8' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                Learn More
              </motion.a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
