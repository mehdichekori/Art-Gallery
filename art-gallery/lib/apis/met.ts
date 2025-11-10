import { ArtPiece, MetMuseumObject, WikipediaSummary } from '@/types/art';

const MET_API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1';

/**
 * Search for painting object IDs from The Met Museum
 */
async function getPaintingObjectIds(onlyHighlighted = false): Promise<number[]> {
  const params = new URLSearchParams({
    medium: 'Paintings',
    q: 'painting',
  });

  if (onlyHighlighted) {
    params.append('isHighlight', 'true');
  }

  const response = await fetch(
    `${MET_API_BASE}/search?${params.toString()}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    throw new Error('Failed to search Met Museum API');
  }

  const data = await response.json();
  return data.objectIDs || [];
}

/**
 * Get a random painting from The Met Museum
 */
export async function getRandomMetPainting(onlyHighlighted = false): Promise<ArtPiece | null> {
  try {
    const objectIds = await getPaintingObjectIds(onlyHighlighted);

    if (objectIds.length === 0) {
      throw new Error('No paintings found');
    }

    // Try up to 10 random paintings to find one with an image
    for (let i = 0; i < 10; i++) {
      const randomId = objectIds[Math.floor(Math.random() * objectIds.length)];

      try {
        const objectResponse = await fetch(`${MET_API_BASE}/objects/${randomId}`, {
          cache: 'no-store',
        });

        if (!objectResponse.ok) continue;

        const artwork: MetMuseumObject = await objectResponse.json();

        // Skip if no image
        if (!artwork.primaryImage || artwork.primaryImage === '') {
          continue;
        }

        // Create the ArtPiece with enriched metadata
        const artPiece: ArtPiece = {
          title: artwork.title || 'Untitled',
          artist: artwork.artistDisplayName || 'Unknown Artist',
          year: artwork.objectDate || 'Date unknown',
          medium: artwork.medium || 'Medium unknown',
          imageUrl: artwork.primaryImageSmall || artwork.primaryImage,
          museum: 'The Metropolitan Museum of Art',
          description: `A ${artwork.medium || 'painting'} from the collection of The Metropolitan Museum of Art.`,
          objectId: artwork.objectID.toString(),
          objectUrl: artwork.objectURL,
          dimensions: artwork.dimensions || undefined,
          culture: artwork.culture || undefined,
          period: artwork.period || undefined,
          classification: artwork.classification || undefined,
          creditLine: artwork.creditLine || undefined,
          department: artwork.department || undefined,
          primaryImageSmall: artwork.primaryImageSmall || undefined,
          tags: artwork.tags ? artwork.tags.map(tag => tag.term).filter(Boolean) : undefined,
          isHighlight: onlyHighlighted,
        };

        return artPiece;
      } catch (err) {
        // Continue to next artwork if this one fails
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching from Met Museum:', error);
    return null;
  }
}

/**
 * Get Wikipedia summary for extra context
 */
export async function getWikipediaSummary(query: string): Promise<WikipediaSummary | null> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Wikipedia:', error);
    return null;
  }
}
