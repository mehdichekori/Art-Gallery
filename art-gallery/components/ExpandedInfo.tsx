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
  if (!artPiece) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="expanded-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="expanded-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="expanded-content">
              <button className="close-button" onClick={onClose} aria-label="Close">
                ×
              </button>

              <div className="expanded-details">
                <h2 className="expanded-title">{artPiece.title}</h2>
                <h3 className="expanded-artist">{artPiece.artist}</h3>

                <div className="expanded-metadata">
                  <p><strong>Year:</strong> {artPiece.year}</p>
                  <p><strong>Medium:</strong> {artPiece.medium}</p>
                  <p><strong>Museum:</strong> {artPiece.museum}</p>
                </div>

                {artPiece.description && (
                  <div className="expanded-description">
                    <p>{artPiece.description}</p>
                  </div>
                )}

                {artPiece.wikiUrl && (
                  <a
                    href={artPiece.wikiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wikipedia-link"
                  >
                    Learn more on Wikipedia
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
