import { ArtPiece, MetMuseumObject, WikipediaSummary } from '@/types/art';

const MET_API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1';

// Cache for object IDs to avoid repeated API calls
let cachedObjectIds: number[] | null = null;
let cachedHighlightedIds: number[] | null = null;
let isLoadingRegular = false;
let isLoadingHighlighted = false;

/**
 * Search for painting object IDs from The Met Museum
 */
async function getPaintingObjectIds(onlyHighlighted = false): Promise<number[]> {
  // Return cached IDs if available
  if (onlyHighlighted) {
    if (cachedHighlightedIds) {
      return cachedHighlightedIds;
    }
    if (isLoadingHighlighted) {
      // Wait for the ongoing request to complete
      while (isLoadingHighlighted) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return cachedHighlightedIds || [];
    }
  } else {
    if (cachedObjectIds) {
      return cachedObjectIds;
    }
    if (isLoadingRegular) {
      // Wait for the ongoing request to complete
      while (isLoadingRegular) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return cachedObjectIds || [];
    }
  }

  // Set loading state
  if (onlyHighlighted) {
    isLoadingHighlighted = true;
  } else {
    isLoadingRegular = true;
  }

  try {
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
    const objectIds = data.objectIDs || [];

    // Cache the results
    if (onlyHighlighted) {
      cachedHighlightedIds = objectIds;
    } else {
      cachedObjectIds = objectIds;
    }

    return objectIds;
  } finally {
    // Clear loading state
    if (onlyHighlighted) {
      isLoadingHighlighted = false;
    } else {
      isLoadingRegular = false;
    }
  }
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

    // Track failed IDs to avoid retrying them
    const failedIds = new Set<number>();
    const maxAttempts = 100; // Try up to 100 different paintings to find one with an image

    // Keep trying until we find a valid image or exhaust all options
    while (failedIds.size < objectIds.length && failedIds.size < maxAttempts) {
      const randomId = objectIds[Math.floor(Math.random() * objectIds.length)];

      // Skip already tried IDs
      if (failedIds.has(randomId)) {
        continue;
      }

      try {
        const objectResponse = await fetch(`${MET_API_BASE}/objects/${randomId}`, {
          cache: 'no-store',
        });

        if (!objectResponse.ok) {
          failedIds.add(randomId);
          continue;
        }

        const artwork: MetMuseumObject = await objectResponse.json();

        // Skip if no image
        if (!artwork.primaryImage || artwork.primaryImage === '') {
          failedIds.add(randomId);
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
          isHighlight: onlyHighlighted,
        };

        return artPiece;
      } catch (err) {
        // Add to failed IDs and continue to next artwork if this one fails
        failedIds.add(randomId);
        continue;
      }
    }

    console.warn(`No valid artwork with image found after checking ${failedIds.size} items`);
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
