import { useEffect, useState, type RefObject } from 'react';

export function useIntersection(
  ref: RefObject<HTMLElement | null>,
  options: IntersectionObserverInit = { threshold: 0, root: null, rootMargin: '0px' },
): boolean {
  const { threshold = 0, root = null, rootMargin = '0px' } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold, root, rootMargin });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, root, rootMargin]);

  return isIntersecting;
}
