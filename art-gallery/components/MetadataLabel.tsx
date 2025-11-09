'use client';

import React from 'react';
import { ArtPiece } from '@/types/art';

interface MetadataLabelProps {
  artPiece: ArtPiece;
}

export default function MetadataLabel({ artPiece }: MetadataLabelProps) {
  return (
    <div className="metadata-label">
      <p className="artwork-title">{artPiece.title}</p>
      <p className="artwork-artist">{artPiece.artist}</p>
      <p className="artwork-year-medium">
        {artPiece.year} • {artPiece.medium}
      </p>
      <p className="artwork-museum">{artPiece.museum}</p>
    </div>
  );
}
