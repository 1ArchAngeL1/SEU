'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Upload,
  MousePointer2,
  Pencil,
  Trash2,
  Copy,
  Check,
  Undo2,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize,
  Move,
  Eye,
  EyeOff,
  Download,
  RectangleHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Types ──────────────────────────────────────────────────────── */

interface Point {
  x: number; // normalized 0-100
  y: number;
}

interface Polygon {
  id: string;
  points: Point[];
  label: string;
  color: string;
  closed: boolean;
  visible: boolean;
}

type Tool = 'select' | 'draw';

const COLORS = [
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#14b8a6', // teal
  '#a855f7', // purple
  '#84cc16', // lime
  '#e11d48', // rose
];

const SNAP_RADIUS = 8; // px distance to snap-close

/* ─── Helpers ────────────────────────────────────────────────────── */

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function nextColor(polygons: Polygon[]) {
  return COLORS[polygons.length % COLORS.length];
}

function exportAll(polygons: Polygon[]) {
  return polygons
    .filter((p) => p.closed && p.points.length >= 3)
    .map((p) => ({
      label: p.label,
      polygon: p.points.map((pt) => ({ x: +pt.x.toFixed(2), y: +pt.y.toFixed(2) })),
    }));
}

/* ─── Main Component ─────────────────────────────────────────────── */

export default function PolygonEditorPage() {
  /* Image */
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  /* Polygons */
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>('draw');

  /* Drag state */
  const [dragInfo, setDragInfo] = useState<{
    polygonId: string;
    pointIndex: number;
  } | null>(null);

  /* Zoom & pan */
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  /* Mouse position for live crosshair */
  const [mouseNorm, setMouseNorm] = useState<Point | null>(null);

  /* Copy feedback */
  const [copied, setCopied] = useState<string | null>(null);

  /* Hover vertex highlight */
  const [hoverVertex, setHoverVertex] = useState<{
    polygonId: string;
    pointIndex: number;
  } | null>(null);

  /* Ortho (right-angle) mode */
  const [ortho, setOrtho] = useState(false);

  /* Show all labels toggle */
  const [showLabels, setShowLabels] = useState(true);

  const activePolygon = useMemo(
    () => polygons.find((p) => p.id === activeId) ?? null,
    [polygons, activeId]
  );

  /* ─── Image upload ─────────────────────────────────────────────── */

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageSize({ w: img.naturalWidth, h: img.naturalHeight });
      setImageSrc(url);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };
    img.src = url;
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  /* ─── Coordinate conversion ────────────────────────────────────── */

  /** Convert a mouse event on the container to normalized 0-100 coords */
  const toNormalized = useCallback(
    (e: React.MouseEvent): Point | null => {
      const img = imgRef.current;
      if (!img) return null;
      const rect = img.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (x < 0 || x > 100 || y < 0 || y > 100) return null;
      return { x, y };
    },
    []
  );

  /** Convert normalized coords to pixel position on screen (for snap detection) */
  const toScreen = useCallback(
    (pt: Point): { sx: number; sy: number } => {
      const img = imgRef.current;
      if (!img) return { sx: 0, sy: 0 };
      const rect = img.getBoundingClientRect();
      return {
        sx: rect.left + (pt.x / 100) * rect.width,
        sy: rect.top + (pt.y / 100) * rect.height,
      };
    },
    []
  );

  /** Snap point to right angles relative to a reference point */
  function snapOrtho(pt: Point, ref: Point): Point {
    const dx = Math.abs(pt.x - ref.x);
    const dy = Math.abs(pt.y - ref.y);
    if (dx > dy) {
      return { x: pt.x, y: ref.y };
    } else {
      return { x: ref.x, y: pt.y };
    }
  }

  /** Apply ortho snap if enabled, using the last point of the active polygon */
  function applyOrtho(pt: Point): Point {
    if (!ortho || !activePolygon || activePolygon.points.length === 0) return pt;
    const last = activePolygon.points[activePolygon.points.length - 1];
    return snapOrtho(pt, last);
  }

  /* ─── Drawing ──────────────────────────────────────────────────── */

  function handleCanvasClick(e: React.MouseEvent) {
    if (tool !== 'draw') return;
    if (dragInfo) return;
    let pt = toNormalized(e);
    if (!pt) return;

    if (!activeId || !activePolygon || activePolygon.closed) {
      // Start new polygon
      const id = uid();
      const newPoly: Polygon = {
        id,
        points: [pt],
        label: `Apt ${polygons.filter((p) => p.closed).length + 1}`,
        color: nextColor(polygons),
        closed: false,
        visible: true,
      };
      setPolygons((prev) => [...prev, newPoly]);
      setActiveId(id);
      return;
    }

    // Apply ortho snap
    pt = applyOrtho(pt);

    // Check snap-close: if clicking near the first point
    const first = activePolygon.points[0];
    const firstScreen = toScreen(first);
    const ptScreen = toScreen(pt);
    const dist = Math.hypot(ptScreen.sx - firstScreen.sx, ptScreen.sy - firstScreen.sy);
    if (activePolygon.points.length >= 3 && dist < SNAP_RADIUS) {
      // Close polygon
      setPolygons((prev) =>
        prev.map((p) => (p.id === activeId ? { ...p, closed: true } : p))
      );
      return;
    }

    // Add point
    setPolygons((prev) =>
      prev.map((p) =>
        p.id === activeId ? { ...p, points: [...p.points, pt] } : p
      )
    );
  }

  function handleCanvasMouseMove(e: React.MouseEvent) {
    const pt = toNormalized(e);
    setMouseNorm(pt);

    // Handle vertex dragging
    if (dragInfo && pt) {
      setPolygons((prev) =>
        prev.map((p) =>
          p.id === dragInfo.polygonId
            ? {
                ...p,
                points: p.points.map((existing, i) =>
                  i === dragInfo.pointIndex ? pt : existing
                ),
              }
            : p
        )
      );
      return;
    }

    // Handle panning
    if (isPanning) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setPan({
        x: panStart.current.panX + dx,
        y: panStart.current.panY + dy,
      });
    }
  }

  function handleCanvasMouseUp() {
    if (dragInfo) setDragInfo(null);
    if (isPanning) setIsPanning(false);
  }

  function handleVertexMouseDown(
    e: React.MouseEvent,
    polygonId: string,
    pointIndex: number
  ) {
    e.stopPropagation();
    if (tool === 'select') {
      setDragInfo({ polygonId, pointIndex });
      setActiveId(polygonId);
    }
  }

  /* ─── Pan & Zoom ───────────────────────────────────────────────── */

  function handleMiddleMouseDown(e: React.MouseEvent) {
    if (e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    }
  }

  function handleWheel(e: React.WheelEvent) {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.max(0.5, Math.min(5, z + delta)));
  }

  /* ─── Actions ──────────────────────────────────────────────────── */

  function undoLastPoint() {
    if (!activeId || !activePolygon || activePolygon.closed) return;
    if (activePolygon.points.length <= 1) {
      // Remove the polygon entirely
      setPolygons((prev) => prev.filter((p) => p.id !== activeId));
      setActiveId(null);
    } else {
      setPolygons((prev) =>
        prev.map((p) =>
          p.id === activeId
            ? { ...p, points: p.points.slice(0, -1) }
            : p
        )
      );
    }
  }

  function deletePolygon(id: string) {
    setPolygons((prev) => prev.filter((p) => p.id !== id));
    if (activeId === id) setActiveId(null);
  }

  function updateLabel(id: string, label: string) {
    setPolygons((prev) =>
      prev.map((p) => (p.id === id ? { ...p, label } : p))
    );
  }

  function toggleVisibility(id: string) {
    setPolygons((prev) =>
      prev.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p))
    );
  }

  function addNewPolygon() {
    setTool('draw');
    // If current active is not closed, close it first
    if (activeId && activePolygon && !activePolygon.closed) {
      if (activePolygon.points.length >= 3) {
        setPolygons((prev) =>
          prev.map((p) => (p.id === activeId ? { ...p, closed: true } : p))
        );
      } else {
        setPolygons((prev) => prev.filter((p) => p.id !== activeId));
      }
    }
    setActiveId(null);
  }

  function toRawCoords(polygon: Polygon): string {
    return polygon.points
      .map((pt) => `${pt.x.toFixed(2)},${pt.y.toFixed(2)}`)
      .join(',');
  }

  function copyCoordinates(polygon: Polygon) {
    navigator.clipboard.writeText(toRawCoords(polygon));
    setCopied(polygon.id);
    setTimeout(() => setCopied(null), 1500);
  }

  function copyAll() {
    const lines = polygons
      .filter((p) => p.closed && p.points.length >= 3)
      .map((p) => `${p.label}: ${toRawCoords(p)}`)
      .join('\n');
    navigator.clipboard.writeText(lines);
    setCopied('all');
    setTimeout(() => setCopied(null), 1500);
  }

  function downloadJSON() {
    const data = exportAll(polygons);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'polygons.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function insertPointAfter(polygonId: string, afterIndex: number) {
    setPolygons((prev) =>
      prev.map((p) => {
        if (p.id !== polygonId) return p;
        const nextIdx = (afterIndex + 1) % p.points.length;
        const a = p.points[afterIndex];
        const b = p.points[nextIdx];
        const mid: Point = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const newPoints = [...p.points];
        newPoints.splice(afterIndex + 1, 0, mid);
        return { ...p, points: newPoints };
      })
    );
  }

  function deleteVertex(polygonId: string, pointIndex: number) {
    setPolygons((prev) =>
      prev.map((p) => {
        if (p.id !== polygonId) return p;
        if (p.points.length <= 3) return p; // keep minimum 3 points
        return { ...p, points: p.points.filter((_, i) => i !== pointIndex) };
      })
    );
  }

  /* ─── Keyboard shortcuts ───────────────────────────────────────── */

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (activeId && activePolygon && !activePolygon.closed) {
          if (activePolygon.points.length >= 3) {
            setPolygons((prev) =>
              prev.map((p) => (p.id === activeId ? { ...p, closed: true } : p))
            );
          } else {
            setPolygons((prev) => prev.filter((p) => p.id !== activeId));
            setActiveId(null);
          }
        } else {
          setActiveId(null);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undoLastPoint();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (
          activeId &&
          activePolygon?.closed &&
          document.activeElement?.tagName !== 'INPUT'
        ) {
          deletePolygon(activeId);
        }
      }
      if (e.key === 'v' || e.key === 'V') {
        if (document.activeElement?.tagName !== 'INPUT') {
          setTool('select');
        }
      }
      if (e.key === 'b' || e.key === 'B') {
        if (document.activeElement?.tagName !== 'INPUT') {
          setTool('draw');
        }
      }
      if (e.key === 'r' || e.key === 'R') {
        if (document.activeElement?.tagName !== 'INPUT') {
          setOrtho((v) => !v);
        }
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, activePolygon]);

  /* ─── Render ───────────────────────────────────────────────────── */

  const closedPolygons = polygons.filter((p) => p.closed);

  // Upload screen
  if (!imageSrc) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-[--font-bodoni] text-seu-heading text-admin-fg">
            Polygon Editor
          </h1>
          <p className="font-montserrat text-seu-caption text-admin-fg-muted mt-1">
            Upload a floor plan image to start tracing apartment polygons
          </p>
        </div>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-admin-border rounded-2xl p-20 text-center hover:border-primary-green/50 transition-colors cursor-pointer"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleFile(file);
            };
            input.click();
          }}
        >
          <Upload className="size-12 text-admin-fg-dim mx-auto mb-4" />
          <p className="font-montserrat text-seu-body text-admin-fg mb-2">
            Drop floor plan image here
          </p>
          <p className="font-montserrat text-seu-caption text-admin-fg-dim">
            or click to browse · PNG, JPG, WebP
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] -mx-8 -my-10">
      {/* Top toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-admin-border bg-admin-card-gradient shrink-0">
        {/* Tool buttons */}
        <div className="flex items-center gap-1 p-1 bg-admin-deep rounded-lg border border-admin-border">
          <button
            onClick={() => setTool('select')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md font-montserrat text-seu-caption-sm transition-all',
              tool === 'select'
                ? 'bg-admin-elevated-gradient text-admin-fg border border-primary-green/30 shadow-sm'
                : 'text-admin-fg-muted hover:text-admin-fg border border-transparent'
            )}
            title="Select & Move (V)"
          >
            <MousePointer2 className="size-3.5" />
            Select
          </button>
          <button
            onClick={() => setTool('draw')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md font-montserrat text-seu-caption-sm transition-all',
              tool === 'draw'
                ? 'bg-admin-elevated-gradient text-admin-fg border border-primary-green/30 shadow-sm'
                : 'text-admin-fg-muted hover:text-admin-fg border border-transparent'
            )}
            title="Draw Polygon (B)"
          >
            <Pencil className="size-3.5" />
            Draw
          </button>
        </div>

        {/* Ortho toggle */}
        <button
          onClick={() => setOrtho((v) => !v)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-montserrat text-seu-caption-sm transition-all',
            ortho
              ? 'bg-primary-green/15 text-primary-green border border-primary-green/30'
              : 'text-admin-fg-muted hover:text-admin-fg'
          )}
          title="Right-angle mode (R)"
        >
          <RectangleHorizontal className="size-3.5" />
          90°
        </button>

        <div className="w-px h-6 bg-admin-border mx-1" />

        {/* Polygon actions */}
        <button
          onClick={addNewPolygon}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-montserrat text-seu-caption-sm text-primary-green hover:bg-primary-green/10 transition-colors"
          title="New polygon"
        >
          <Plus className="size-3.5" />
          New Apartment
        </button>
        <button
          onClick={undoLastPoint}
          disabled={!activeId || !activePolygon || activePolygon.closed}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-montserrat text-seu-caption-sm text-admin-fg-muted hover:text-admin-fg disabled:opacity-30 transition-colors"
          title="Undo last point (Ctrl+Z)"
        >
          <Undo2 className="size-3.5" />
        </button>

        <div className="w-px h-6 bg-admin-border mx-1" />

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            className="p-1.5 rounded-md text-admin-fg-muted hover:text-admin-fg transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="size-4" />
          </button>
          <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted w-12 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(5, z + 0.25))}
            className="p-1.5 rounded-md text-admin-fg-muted hover:text-admin-fg transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="size-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="p-1.5 rounded-md text-admin-fg-muted hover:text-admin-fg transition-colors"
            title="Reset view"
          >
            <Maximize className="size-4" />
          </button>
        </div>

        <div className="flex-1" />

        {/* Mouse coords */}
        {mouseNorm && (
          <span className="font-mono text-seu-caption-sm text-admin-fg-dim tabular-nums">
            {mouseNorm.x.toFixed(1)}, {mouseNorm.y.toFixed(1)}
          </span>
        )}

        <div className="w-px h-6 bg-admin-border mx-1" />

        {/* Image info */}
        <span className="font-montserrat text-seu-caption-sm text-admin-fg-dim">
          {imageSize.w} × {imageSize.h}px
        </span>

        {/* Upload new */}
        <button
          onClick={() => {
            setImageSrc(null);
            setPolygons([]);
            setActiveId(null);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-montserrat text-seu-caption-sm text-admin-fg-muted hover:text-admin-fg transition-colors"
        >
          <Upload className="size-3.5" />
          New Image
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* ─── Canvas area ─────────────────────────────────────────── */}
        <div
          ref={containerRef}
          className={cn(
            'flex-1 min-w-0 overflow-hidden relative bg-admin-deep',
            tool === 'draw' ? 'cursor-crosshair' : 'cursor-default',
            isPanning && 'cursor-grabbing'
          )}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={() => {
            setMouseNorm(null);
            handleCanvasMouseUp();
          }}
          onMouseDown={handleMiddleMouseDown}
          onWheel={handleWheel}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Checkerboard bg */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(45deg, var(--admin-deep) 25%, transparent 25%), linear-gradient(-45deg, var(--admin-deep) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--admin-deep) 75%), linear-gradient(-45deg, transparent 75%, var(--admin-deep) 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              opacity: 0.3,
            }}
          />

          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Floor plan"
                className="max-w-full max-h-full w-auto h-auto select-none"
                draggable={false}
              />

              {/* SVG overlay */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
                style={{ pointerEvents: 'none' }}
              >
                {/* Completed polygons */}
                {polygons
                  .filter((p) => p.visible)
                  .map((polygon) => (
                    <g key={polygon.id}>
                      {/* Fill */}
                      <polygon
                        points={polygon.points
                          .map((pt) => `${pt.x},${pt.y}`)
                          .join(' ')}
                        fill={
                          polygon.closed
                            ? polygon.id === activeId
                              ? polygon.color + '50'
                              : polygon.color + '25'
                            : 'none'
                        }
                        stroke={polygon.color}
                        strokeWidth={polygon.id === activeId ? 0.5 : 0.3}
                        strokeDasharray={polygon.closed ? 'none' : '1,1'}
                        className="transition-all duration-150"
                        style={{ pointerEvents: polygon.closed ? 'all' : 'none' }}
                        onClick={(e) => {
                          if (tool === 'select') {
                            e.stopPropagation();
                            setActiveId(polygon.id);
                          }
                        }}
                      />
                      {/* Stroke glow for active */}
                      {polygon.id === activeId && polygon.closed && (
                        <polygon
                          points={polygon.points
                            .map((pt) => `${pt.x},${pt.y}`)
                            .join(' ')}
                          fill="none"
                          stroke={polygon.color}
                          strokeWidth={0.8}
                          opacity={0.5}
                          style={{ pointerEvents: 'none' }}
                        />
                      )}
                      {/* Edge midpoints for inserting new vertices (select mode + active) */}
                      {tool === 'select' &&
                        polygon.id === activeId &&
                        polygon.closed &&
                        polygon.points.map((pt, i) => {
                          const next =
                            polygon.points[(i + 1) % polygon.points.length];
                          const mx = (pt.x + next.x) / 2;
                          const my = (pt.y + next.y) / 2;
                          return (
                            <circle
                              key={`mid-${i}`}
                              cx={mx}
                              cy={my}
                              r={0.4}
                              fill={polygon.color}
                              opacity={0.4}
                              className="hover:opacity-100 transition-opacity cursor-pointer"
                              style={{ pointerEvents: 'all' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                insertPointAfter(polygon.id, i);
                              }}
                            />
                          );
                        })}
                      {/* Vertices */}
                      {(polygon.id === activeId || !polygon.closed) &&
                        polygon.points.map((pt, i) => {
                          const isFirst = i === 0 && !polygon.closed;
                          const isHovered =
                            hoverVertex?.polygonId === polygon.id &&
                            hoverVertex?.pointIndex === i;
                          return (
                            <circle
                              key={i}
                              cx={pt.x}
                              cy={pt.y}
                              r={isFirst ? 0.8 : isHovered ? 0.7 : 0.5}
                              fill={isFirst ? '#22c55e' : polygon.color}
                              stroke="white"
                              strokeWidth={0.15}
                              className={cn(
                                'transition-all duration-100',
                                tool === 'select'
                                  ? 'cursor-grab'
                                  : isFirst
                                    ? 'cursor-pointer'
                                    : ''
                              )}
                              style={{ pointerEvents: 'all' }}
                              onMouseDown={(e) =>
                                handleVertexMouseDown(
                                  e,
                                  polygon.id,
                                  i
                                )
                              }
                              onMouseEnter={() =>
                                setHoverVertex({
                                  polygonId: polygon.id,
                                  pointIndex: i,
                                })
                              }
                              onMouseLeave={() => setHoverVertex(null)}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (polygon.closed) {
                                  deleteVertex(polygon.id, i);
                                }
                              }}
                            />
                          );
                        })}
                      {/* Label */}
                      {polygon.closed && showLabels && polygon.points.length >= 3 && (() => {
                        const cx =
                          polygon.points.reduce((s, p) => s + p.x, 0) /
                          polygon.points.length;
                        const cy =
                          polygon.points.reduce((s, p) => s + p.y, 0) /
                          polygon.points.length;
                        return (
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="white"
                            fontSize="1.8"
                            fontFamily="var(--font-montserrat), sans-serif"
                            fontWeight="600"
                            style={{ pointerEvents: 'none', textShadow: '0 0 3px rgba(0,0,0,0.8)' }}
                          >
                            {polygon.label}
                          </text>
                        );
                      })()}
                    </g>
                  ))}

                {/* Drawing preview line from last point to mouse */}
                {tool === 'draw' &&
                  activePolygon &&
                  !activePolygon.closed &&
                  mouseNorm &&
                  (() => {
                    const snapped = applyOrtho(mouseNorm);
                    return (
                    <line
                      x1={
                        activePolygon.points[activePolygon.points.length - 1].x
                      }
                      y1={
                        activePolygon.points[activePolygon.points.length - 1].y
                      }
                      x2={snapped.x}
                      y2={snapped.y}
                      stroke={activePolygon.color}
                      strokeWidth={0.25}
                      strokeDasharray="0.5,0.5"
                      opacity={0.7}
                    />
                    );
                  })()}
              </svg>
            </div>
          </div>

          {/* Drawing hint */}
          {tool === 'draw' && activePolygon && !activePolygon.closed && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-admin-deep/90 backdrop-blur border border-admin-border rounded-full px-4 py-2 pointer-events-none">
              <p className="font-montserrat text-seu-caption-sm text-admin-fg whitespace-nowrap">
                Click to add points · Click first point (green) to close ·{' '}
                <span className="text-admin-fg-dim">Esc to finish · Ctrl+Z to undo</span>
              </p>
            </div>
          )}

          {/* Pan hint */}
          <div className="absolute bottom-4 right-4 font-montserrat text-[0.6rem] text-admin-fg-dim">
            Scroll to zoom · Middle-click to pan
          </div>
        </div>

        {/* ─── Right panel ─────────────────────────────────────────── */}
        <div className="w-80 border-l border-admin-border bg-admin-card-gradient flex flex-col shrink-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-admin-border">
            <h2 className="font-montserrat font-semibold text-seu-caption text-admin-fg">
              Apartments ({closedPolygons.length})
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowLabels(!showLabels)}
                className="p-1.5 rounded-md text-admin-fg-muted hover:text-admin-fg transition-colors"
                title={showLabels ? 'Hide labels' : 'Show labels'}
              >
                {showLabels ? (
                  <Eye className="size-3.5" />
                ) : (
                  <EyeOff className="size-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Polygon list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {polygons.length === 0 && (
              <p className="font-montserrat text-seu-caption-sm text-admin-fg-dim text-center py-8">
                Start drawing on the image to create apartment polygons
              </p>
            )}
            {polygons.map((polygon) => (
              <div
                key={polygon.id}
                className={cn(
                  'rounded-lg border p-3 transition-all cursor-pointer',
                  polygon.id === activeId
                    ? 'border-primary-green/40 bg-primary-green/5 shadow-sm'
                    : 'border-admin-border-soft bg-admin-deep/30 hover:border-admin-border'
                )}
                onClick={() => setActiveId(polygon.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="size-3 rounded-full shrink-0 ring-1 ring-white/20"
                    style={{ backgroundColor: polygon.color }}
                  />
                  <input
                    value={polygon.label}
                    onChange={(e) => updateLabel(polygon.id, e.target.value)}
                    className="flex-1 bg-transparent font-montserrat text-seu-caption text-admin-fg outline-none border-b border-transparent focus:border-admin-border transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility(polygon.id);
                      }}
                      className="p-1 rounded text-admin-fg-dim hover:text-admin-fg transition-colors"
                      title={polygon.visible ? 'Hide' : 'Show'}
                    >
                      {polygon.visible ? (
                        <Eye className="size-3" />
                      ) : (
                        <EyeOff className="size-3" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyCoordinates(polygon);
                      }}
                      className="p-1 rounded text-admin-fg-dim hover:text-admin-fg transition-colors"
                      title="Copy coordinates"
                    >
                      {copied === polygon.id ? (
                        <Check className="size-3 text-green-400" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePolygon(polygon.id);
                      }}
                      className="p-1 rounded text-admin-fg-dim hover:text-rose-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-montserrat text-[0.6rem] text-admin-fg-dim">
                    {polygon.points.length} pts
                  </span>
                  {!polygon.closed && (
                    <span className="font-montserrat text-[0.6rem] text-amber-400">
                      drawing...
                    </span>
                  )}
                  {polygon.closed && (
                    <span className="font-montserrat text-[0.6rem] text-green-400">
                      closed
                    </span>
                  )}
                </div>
                {/* Normalized coords preview */}
                {polygon.id === activeId && polygon.closed && (
                  <div className="mt-2 p-2 rounded bg-admin-deep/60 border border-admin-border-soft">
                    <p className="font-mono text-[0.55rem] text-admin-fg-dim leading-relaxed break-all select-all">
                      {toRawCoords(polygon)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Export footer */}
          {closedPolygons.length > 0 && (
            <div className="border-t border-admin-border p-3 space-y-2">
              <button
                onClick={copyAll}
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-montserrat font-medium text-seu-caption transition-all',
                  'bg-gradient-to-b from-primary-green to-primary-green/85 text-white shadow-md shadow-primary-green/25 hover:shadow-lg'
                )}
              >
                {copied === 'all' ? (
                  <>
                    <Check className="size-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    Copy All ({closedPolygons.length})
                  </>
                )}
              </button>
              <button
                onClick={downloadJSON}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-montserrat text-seu-caption-sm text-admin-fg-muted hover:text-admin-fg border border-admin-border hover:border-admin-border-strong transition-all"
              >
                <Download className="size-3.5" />
                Download JSON
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard shortcut legend */}
      <div className="flex items-center gap-4 px-4 py-1.5 border-t border-admin-border bg-admin-card-gradient shrink-0">
        {[
          ['V', 'Select'],
          ['B', 'Draw'],
          ['R', '90° mode'],
          ['Ctrl+Z', 'Undo'],
          ['Esc', 'Close/Cancel'],
          ['Del', 'Delete polygon'],
          ['Right-click vertex', 'Remove point'],
        ].map(([key, desc]) => (
          <span
            key={key}
            className="font-montserrat text-[0.6rem] text-admin-fg-dim"
          >
            <kbd className="px-1 py-0.5 rounded bg-admin-deep border border-admin-border text-admin-fg-muted font-mono">
              {key}
            </kbd>{' '}
            {desc}
          </span>
        ))}
      </div>
    </div>
  );
}
