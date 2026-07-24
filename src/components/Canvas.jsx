import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Reusable scientific Canvas wrapper component (matplotlib / textbook style).
 * - Thin black border with white background.
 * - Handles window resize, high-DPI (devicePixelRatio) rendering, and mobile touch interaction.
 * - Supports vertical page scrolling on mobile via touch-pan-y.
 * - Exposes canvas ref, 2D context, and dimensions to children / render callback.
 */
const Canvas = ({
  children,
  className = '',
  aspectRatio,
  onCanvasClick,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400, dpr: 1 });
  const [ctx, setCtx] = useState(null);

  const handleResize = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const width = Math.floor(rect.width);
    const height = aspectRatio
      ? Math.floor(width / aspectRatio)
      : Math.max(Math.floor(rect.height), 320);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext('2d');
    if (context) {
      context.scale(dpr, dpr);
      setCtx(context);
    }

    setDimensions({ width, height, dpr });
  }, [aspectRatio]);

  useEffect(() => {
    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Default drawing if no children provided
  useEffect(() => {
    if (!ctx || children) return;
    const { width, height } = dimensions;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw axes & gridlines like a matplotlib plot
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = step; x < width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = step; y < height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
  }, [ctx, dimensions, children]);

  const handleClick = (e) => {
    if (!canvasRef.current || !onCanvasClick) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);

    if (clientX === null || clientY === null) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    onCanvasClick({ x, y, canvasX: x, canvasY: y, event: e });
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[280px] sm:min-h-[320px] bg-white border border-slate-900 overflow-hidden flex items-center justify-center ${className}`}
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onTouchStart={handleClick}
        className="block cursor-crosshair touch-pan-y"
      />

      {typeof children === 'function'
        ? children({ canvasRef, ctx, dimensions })
        : children}
    </div>
  );
};

export default Canvas;
