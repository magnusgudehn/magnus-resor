const CACHE_KEY = 'destination_images';
const UNSPLASH_ACCESS_KEY = 'zQjStJiHD5v_dd-0BdUS0fdGvYD0DpzdbxviwOwBfVw';

interface CachedImage {
  url: string;
  timestamp: number;
  destination: string;
}

export const imageService = {
  async getDestinationImage(destination: string): Promise<string> {
    try {
      // Kolla cache först
      const cached = this.getCachedImage(destination);
      if (cached) return cached;

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${destination}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&per_page=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const data = await response.json();
      const imageUrl = data.results[0]?.urls.regular;
      
      if (imageUrl) {
        // Spara i cache
        this.cacheImage(destination, imageUrl);
        return imageUrl;
      }

      return '/default-trip.jpg';
    } catch (error) {
      console.error('Error fetching destination image:', error);
      return '/default-trip.jpg';
    }
  },

  getCachedImage(destination: string): string | null {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const images: CachedImage[] = JSON.parse(cached);
    const image = images.find(img => 
      img.destination.toLowerCase() === destination.toLowerCase()
    );

    // Cache i 24 timmar
    if (image && Date.now() - image.timestamp < 24 * 60 * 60 * 1000) {
      return image.url;
    }

    return null;
  },

  cacheImage(destination: string, url: string) {
    const cached = localStorage.getItem(CACHE_KEY);
    const images: CachedImage[] = cached ? JSON.parse(cached) : [];

    const newImages = [
      ...images.filter(img => img.destination !== destination),
      {
        destination,
        url,
        timestamp: Date.now()
      }
    ];

    localStorage.setItem(CACHE_KEY, JSON.stringify(newImages));
  }
}; 