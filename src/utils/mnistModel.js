/**
 * Downsamples a 280x280 HTML canvas to a 28x28 grayscale pixel array (784 values, 0.0 to 1.0).
 */
export function downsampleCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const srcWidth = canvas.width;
  const srcHeight = canvas.height;

  // Create temporary 28x28 canvas
  const offscreen = document.createElement('canvas');
  offscreen.width = 28;
  offscreen.height = 28;
  const offCtx = offscreen.getContext('2d');

  // Fill offscreen with white background
  offCtx.fillStyle = '#ffffff';
  offCtx.fillRect(0, 0, 28, 28);

  // Draw scaled down version
  offCtx.drawImage(canvas, 0, 0, srcWidth, srcHeight, 0, 0, 28, 28);

  const imgData = offCtx.getImageData(0, 0, 28, 28);
  const data = imgData.data;

  // Convert RGB to normalized grayscale (0.0 = white background, 1.0 = black stroke)
  const pixels = new Float32Array(784);
  for (let i = 0; i < 784; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    // Invert so drawn black stroke is 1.0, background white is 0.0
    const gray = (r + g + b) / 3;
    pixels[i] = Math.max(0, Math.min(1, (255 - gray) / 255));
  }

  return pixels;
}
