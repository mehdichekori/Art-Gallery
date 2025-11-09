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

  return (
    <motion.div
      className="museum-info-panel-inline"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="museum-panel-content">
        <div className="museum-panel-header">
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="museum-panel-details">
          <h2 className="museum-title">{artPiece.title}</h2>
          <h3 className="museum-artist">{artPiece.artist}</h3>

          <div className="museum-metadata-section">
            <div className="metadata-row">
              <span className="metadata-label">Date</span>
              <span className="metadata-value">{artPiece.year}</span>
            </div>
            <div className="metadata-row">
              <span className="metadata-label">Medium</span>
              <span className="metadata-value">{artPiece.medium}</span>
            </div>
            {artPiece.dimensions && (
              <div className="metadata-row">
                <span className="metadata-label">Dimensions</span>
                <span className="metadata-value">{artPiece.dimensions}</span>
              </div>
            )}
            {artPiece.culture && (
              <div className="metadata-row">
                <span className="metadata-label">Culture</span>
                <span className="metadata-value">{artPiece.culture}</span>
              </div>
            )}
            {artPiece.classification && (
              <div className="metadata-row">
                <span className="metadata-label">Classification</span>
                <span className="metadata-value">{artPiece.classification}</span>
              </div>
            )}
            {artPiece.department && (
              <div className="metadata-row">
                <span className="metadata-label">Department</span>
                <span className="metadata-value">{artPiece.department}</span>
              </div>
            )}
            <div className="metadata-row">
              <span className="metadata-label">Accession Number</span>
              <span className="metadata-value">{artPiece.objectId}</span>
            </div>
          </div>

          {artPiece.creditLine && (
            <div className="museum-credit-line">
              <p>{artPiece.creditLine}</p>
            </div>
          )}

          {artPiece.description && (
            <div className="museum-description">
              <p>{artPiece.description}</p>
            </div>
          )}

          {artPiece.tags && artPiece.tags.length > 0 && (
            <div className="museum-tags">
              {artPiece.tags.map((tag, index) => (
                <span key={index} className="museum-tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="museum-links">
            {artPiece.objectUrl && (
              <a
                href={artPiece.objectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="museum-link-button"
              >
                View on Museum Website
              </a>
            )}
            {artPiece.wikiUrl && (
              <a
                href={artPiece.wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="museum-link-button secondary"
              >
                Learn More
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
