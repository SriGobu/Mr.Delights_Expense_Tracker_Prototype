import { useEffect, useRef } from "react";

// Calls onLoadMore() when the returned ref's element (put it under the list) scrolls into view.
// `watch` should be the number of rows currently shown: the observer is re-created after each
// batch, so loading also continues on tall screens where the sentinel is still visible.
export function useInfiniteScroll({ hasMore, onLoadMore, watch }) {
  const sentinelRef = useRef(null);
  const loadRef = useRef(onLoadMore);

  useEffect(() => {
    loadRef.current = onLoadMore;
  });

  useEffect(() => {
    const el = sentinelRef.current;
    if (!hasMore || !el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && loadRef.current(),
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, watch]);

  return sentinelRef;
}