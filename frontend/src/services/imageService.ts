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
      console.log('Hämtar bild för destination:', destination);
      
      // Kontrollera cache först
      const cachedImage = this.getCachedImage(destination);
      if (cachedImage) {
        console.log('Använder cachad bild');
        return cachedImage;
      }

      console.log('Gör API-anrop till Unsplash');
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination)}&per_page=1`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      console.log('API-svar:', response.status, response.statusText);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Ogiltig Unsplash API-nyckel. Kontrollera din nyckel.');
        }
        throw new Error(`Kunde inte hämta bild från Unsplash: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API-data:', data);
      
      const imageUrl = data.results[0]?.urls?.regular;
      if (!imageUrl) {
        throw new Error('Ingen bild hittades för denna destination');
      }

      // Spara i cache
      this.cacheImage(destination, imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Fel vid hämtning av bild:', error);
      return '/placeholder-image.jpg';
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