'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtPiece } from '@/types/art';
import { getEnrichedPainting } from '@/lib/apis';
import ArtDisplay from './ArtDisplay';
import MetadataLabel from './MetadataLabel';
import ExpandedInfo from './ExpandedInfo';
import { useFrameSelector } from '@/hooks/useFrameSelector';

const ROTATION_INTERVAL = 45000; // 45 seconds (between 30-60)

export default function Gallery() {
  const [currentArt, setCurrentArt] = useState<ArtPiece | null>(null);
  const [nextArt, setNextArt] = useState<ArtPiece | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState(false);
  const { currentFrame, selectRandomFrame } = useFrameSelector();

  // Fetch initial artwork
  useEffect(() => {
    loadArtwork();
  }, []);

  // Set up rotation interval
  useEffect(() => {
    if (!currentArt) return;

    const interval = setInterval(() => {
      rotateArtwork();
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [currentArt, nextArt]);

  const loadArtwork = async (preload = false) => {
    try {
      setError(null);
      const artPiece = await getEnrichedPainting();

      if (!artPiece) {
        setError('No artwork found. Please try again.');
        return;
      }

      if (preload) {
        setNextArt(artPiece);
      } else {
        setCurrentArt(artPiece);
        // Preload next artwork
        setNextArt(null);
        loadArtwork(true);
      }
    } catch (err) {
      setError('Failed to load artwork. Please try again.');
      console.error('Error loading artwork:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const rotateArtwork = async () => {
    if (!nextArt) {
      // If we don't have a preloaded next artwork, load it
      loadArtwork(true);
      return;
    }

    setIsTransitioning(true);

    // Wait for transition animation
    setTimeout(() => {
      setCurrentArt(nextArt);
      setNextArt(null);
      selectRandomFrame();
      setIsTransitioning(false);

      // Start loading the next artwork
      loadArtwork(true);
    }, 500);
  };

  const handleArtworkClick = () => {
    setExpandedInfo(true);
  };

  const handleCloseExpanded = () => {
    setExpandedInfo(false);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading gallery...</p>
      </div>
    );
  }

  if (error || !currentArt) {
    return (
      <div className="error-screen">
        <p>{error || 'No artwork available'}</p>
        <button onClick={() => loadArtwork()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <AnimatePresence mode="wait">
        {currentArt && (
          <ArtDisplay
            key={currentArt.objectId || currentArt.title}
            artPiece={currentArt}
            onClick={handleArtworkClick}
            frameStyle={currentFrame}
          />
        )}
      </AnimatePresence>

      {currentArt && !isTransitioning && <MetadataLabel artPiece={currentArt} />}

      <ExpandedInfo
        artPiece={currentArt}
        isOpen={expandedInfo}
        onClose={handleCloseExpanded}
      />

      {/* Preload indicator */}
      {nextArt && <div style={{ display: 'none' }} />}
    </div>
  );
}
