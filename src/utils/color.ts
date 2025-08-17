/**
 * 从图片中提取主色调
 * @param img 图片元素
 * @param callback 回调函数，返回提取的颜色
 */
export function getImageColor(img: HTMLImageElement, callback: (color: string) => void): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    callback('rgb(245, 245, 245)');
    return;
  }

  const width = img.width || 32;
  const height = img.height || 32;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height).data;

  const colorCounts: Record<string, number> = {};
  
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    const a = imageData[i + 3];

    // 忽略透明度较低的像素
    if (a < 125) continue;

    const color = `rgb(${r}, ${g}, ${b})`;
    colorCounts[color] = (colorCounts[color] || 0) + 1;
  }

  // 找出出现次数最多的颜色
  const dominantColor = Object.keys(colorCounts).reduce(
    (a, b) => (colorCounts[a] > colorCounts[b] ? a : b),
    'rgb(245, 245, 245)'
  );

  callback(dominantColor);
}

/**
 * 将RGB颜色转换为RGBA格式并设置透明度
 * @param rgb RGB颜色字符串，格式为 "rgb(r, g, b)"
 * @param alpha 透明度值，范围 0-1
 * @returns RGBA颜色字符串
 */
export function convertToRGBA(rgb: string, alpha: number = 0.4): string {
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) {
    return `rgba(245, 245, 245, ${alpha})`;
  }
  
  const [r, g, b] = match.map(Number);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
