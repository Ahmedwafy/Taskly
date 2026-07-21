import { useEffect, useState } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}

// =========== Generic Custom Hook if needed ===========
/* 
import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
    const [matches, setMatches] = useState<boolean>(false);
    
    useEffect(() => {
        const media = window.matchMedia(query);
        
        const updateMatch = () => {
            setMatches(media.matches);
        };
        
        updateMatch();
        
        media.addEventListener('change', updateMatch);
        
        return () => {
            media.removeEventListener('change', updateMatch);
        };
    }, [query]);
    
    return matches;
}

Usage:
const isMobile = useMediaQuery('(max-width: 639px)');
const isTablet = useMediaQuery('(max-width: 1024px)');
const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

*/
