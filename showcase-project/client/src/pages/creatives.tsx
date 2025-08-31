import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Link } from "wouter";

// --- Type Definition for a Gallery Item ---
interface Creative {
  id: number;
  title?: string;
  slug: string;
  description?: string;
  image?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  createdAt: string;
}

// --- Gallery Item Component ---
// This component represents a single piece of art in the gallery.
function GalleryItem({ item, style }: { item: Creative; style?: React.CSSProperties }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const getImageUrl = (imagePath: string | undefined): string => {
    // Handle undefined or null imagePath
    if (!imagePath) {
      return '/placeholder-image.jpg'; // You can add a placeholder image
    }
    // If it's already a full URL, return it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // For creative images, they should be in /creatives/ folder
    if (!imagePath.startsWith('/')) {
      return `/creatives/${imagePath}`;
    }
    return imagePath;
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);
  };

  // Calculate aspect ratio for responsive height
  const aspectRatio = imageDimensions.width > 0 ? imageDimensions.height / imageDimensions.width : 1;
  const maxHeight = Math.min(500, Math.max(200, aspectRatio * 300)); // Flexible height based on aspect ratio

  return (
    <div 
      className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl"
      style={{
        ...style,
        marginBottom: '20px',
        breakInside: 'avoid',
        height: imageLoaded ? 'auto' : '300px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/creatives/${item.slug}`}>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={getImageUrl(item.image)}
            alt={item.title || `Creative work ${item.id}`}
            className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            loading="lazy"
            onLoad={handleImageLoad}
            style={{
              maxHeight: imageLoaded ? 'none' : '300px',
              minHeight: imageLoaded ? 'auto' : '200px'
            }}
          />
          {/* Interactive Overlay - Only show if there's title or description */}
          {(item.title || item.description) && (
            <div 
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            >
              <div className="absolute bottom-0 left-0 p-4 w-full">
                {item.title && (
                  <h3 className="text-lg font-bold text-white mb-1 transform transition-transform duration-300 ease-out group-hover:translate-y-0 translate-y-4 opacity-0 group-hover:opacity-100">
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className="text-sm text-white/80 transform transition-transform duration-300 ease-out delay-75 group-hover:translate-y-0 translate-y-4 opacity-0 group-hover:opacity-100 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}


// --- Masonry Layout Component ---
function MasonryGrid({ items }: { items: Creative[] }) {
  const [columns, setColumns] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive column calculation
  useEffect(() => {
    const updateColumns = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width < 640) setColumns(1);
        else if (width < 768) setColumns(2);
        else if (width < 1024) setColumns(3);
        else if (width < 1280) setColumns(4);
        else setColumns(5);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Distribute items across columns
  const distributeItems = () => {
    const cols: Creative[][] = Array.from({ length: columns }, () => []);
    
    items.forEach((item, index) => {
      const columnIndex = index % columns;
      cols[columnIndex].push(item);
    });
    
    return cols;
  };

  const columnItems = distributeItems();

  return (
    <div 
      ref={containerRef}
      className="flex gap-4 justify-center"
      style={{ maxWidth: '1400px', margin: '0 auto' }}
    >
      {columnItems.map((columnContent, columnIndex) => (
        <div 
          key={columnIndex}
          className="flex flex-col"
          style={{ 
            flex: '1',
            minWidth: 0,
            maxWidth: `${100 / columns}%`
          }}
        >
          {columnContent.map((item) => (
            <GalleryItem key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}
// --- Main Creatives Page Component ---
export default function CreativesPage() {
  const { data: creatives = [], isLoading } = useQuery<Creative[]>({
    queryKey: ["/api/creatives"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-16">
              <h1 className="text-5xl sm:text-6xl font-sans font-bold mb-4 gradient-text">
                Creative Corner
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Random Sketches as a Hobby. Most inspirations are from Pinterest! 
              </p>
            </header>

            {/* Loading skeleton with improved masonry layout */}
            <div className="flex gap-4 justify-center max-w-7xl mx-auto">
              {[...Array(4)].map((_, colIndex) => (
                <div key={colIndex} className="flex flex-col flex-1 gap-4">
                  {[...Array(3)].map((_, itemIndex) => (
                    <div 
                      key={itemIndex} 
                      className="animate-pulse bg-muted/30 rounded-lg"
                      style={{
                        height: `${Math.floor(Math.random() * 200) + 250}px`
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-sans font-bold mb-4 gradient-text">
              Creative Corner
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Random Sketches as a Hobby. Most inspirations are from Pinterest! 
            </p>
          </header>

          {/* Masonry Gallery Layout */}
          <MasonryGrid items={creatives} />

          {/* Empty state */}
          {creatives.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                No creative works found. Check back soon for updates!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
