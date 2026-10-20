import { useCallback, useEffect, useRef, useState } from 'react';
import { MAP_HEIGHT, MAP_WIDTH } from '../data/mapLayout.js';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3.5;

function clampViewport(v) {
  const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom));
  const w = MAP_WIDTH / zoom;
  const h = MAP_HEIGHT / zoom;
  return {
    zoom,
    cx: Math.min(MAP_WIDTH - w / 2, Math.max(w / 2, v.cx)),
    cy: Math.min(MAP_HEIGHT - h / 2, Math.max(h / 2, v.cy)),
  };
}

export function useMapViewport(initialZoom = 1) {
  const [viewport, setViewport] = useState(
    clampViewport({ cx: MAP_WIDTH / 2, cy: MAP_HEIGHT / 2, zoom: initialZoom }),
  );
  const frame = useRef(null);
  const current = useRef(viewport);

  useEffect(() => {
    current.current = viewport;
  }, [viewport]);

  const animateTo = useCallback((target, duration = 650) => {
    if (frame.current) cancelAnimationFrame(frame.current);
    const start = current.current;
    const end = clampViewport(target);
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setViewport({
        cx: start.cx + (end.cx - start.cx) * e,
        cy: start.cy + (end.cy - start.cy) * e,
        zoom: start.zoom + (end.zoom - start.zoom) * e,
      });
      if (p < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }, []);

  const flyTo = useCallback((point, zoom = 2.4) => animateTo({ cx: point.x, cy: point.y, zoom }), [animateTo]);
  const zoomBy = useCallback((factor) => animateTo({ ...current.current, zoom: current.current.zoom * factor }, 250), [animateTo]);
  const reset = useCallback(() => animateTo({ cx: MAP_WIDTH / 2, cy: MAP_HEIGHT / 2, zoom: 1 }), [animateTo]);
  const panBy = useCallback((dx, dy) => {
    setViewport((v) => clampViewport({ ...v, cx: v.cx + dx, cy: v.cy + dy }));
  }, []);

  const w = MAP_WIDTH / viewport.zoom;
  const h = MAP_HEIGHT / viewport.zoom;
  const viewBox = `${viewport.cx - w / 2} ${viewport.cy - h / 2} ${w} ${h}`;

  return { viewport, viewBox, flyTo, zoomBy, reset, panBy };
}
