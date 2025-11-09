import { ArtPiece, RijksmuseumObject } from '@/types/art';

const RIJKSMUSEUM_API_BASE = 'https://www.rijksmuseum.nl/api/en/collection';

// Note: In production, this should be in environment variables
// Get your free API key at: https://www.rijksmuseum.nl/en/contact
const API_KEY = process.env.NEXT_PUBLIC_RIJKSMUSEUM_API_KEY || '';

/**
 * Get a random painting from Rijksmuseum
 */
export async function getRandomRijksmuseumPainting(): Promise<ArtPiece | null> {
  if (!API_KEY) {
    console.warn('Rijksmuseum API key not configured. Skipping.');
    return null;
  }

  try {
    // Get a random page of results (up to page 100)
    const page = Math.floor(Math.random() * 100) + 1;
    const response = await fetch(
      `${RIJKSMUSEUM_API_BASE}?key=${API_KEY}&type=painting&p=${page}&ps=100`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('Failed to search Rijksmuseum API');
    }

    const data = await response.json();

    if (!data.artObjects || data.artObjects.length === 0) {
      return null;
    }

    // Try up to 10 random paintings
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * data.artObjects.length);
      const artwork: RijksmuseumObject = data.artObjects[randomIndex];

      // Skip if no image
      if (!artwork.webImage || !artwork.webImage.url) {
        continue;
      }

      const artPiece: ArtPiece = {
        title: artwork.title || 'Untitled',
        artist: artwork.principalOrFirstMaker || 'Unknown Artist',
        year: artwork.longTitle || 'Date unknown',
        medium: 'Painting',
        imageUrl: artwork.webImage.url,
        museum: 'Rijksmuseum',
        description: artwork.label?.description || `A painting from the Rijksmuseum collection.`,
        objectId: artwork.id,
      };

      return artPiece;
    }

    return null;
  } catch (error) {
    console.error('Error fetching from Rijksmuseum:', error);
    return null;
  }
}
