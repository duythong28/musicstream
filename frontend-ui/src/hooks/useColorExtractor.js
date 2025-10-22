import { useState, useEffect } from "react";

export const useColorExtractor = (imageUrl) => {
  const [colors, setColors] = useState({
    dominant: "#000000",
    vibrant: "#000000",
    muted: "#535353",
  });

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      // Use smaller size for faster processing
      canvas.width = 100;
      canvas.height = 100;
      
      ctx.drawImage(img, 0, 0, 100, 100);
      
      try {
        const imageData = ctx.getImageData(0, 0, 100, 100);
        const pixels = imageData.data;
        
        // Color frequency map
        const colorMap = {};
        
        for (let i = 0; i < pixels.length; i += 16) { // Sample every 4 pixels
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          
          // Skip transparent or very dark/light pixels
          if (a < 125 || (r + g + b) < 50 || (r + g + b) > 700) continue;
          
          const key = `${Math.floor(r / 10)},${Math.floor(g / 10)},${Math.floor(b / 10)}`;
          colorMap[key] = (colorMap[key] || 0) + 1;
        }
        
        // Get dominant color
        let maxCount = 0;
        let dominantKey = "19,18,21"; // Default dark
        
        for (const [key, count] of Object.entries(colorMap)) {
          if (count > maxCount) {
            maxCount = count;
            dominantKey = key;
          }
        }
        
        const [r, g, b] = dominantKey.split(",").map((v) => parseInt(v) * 10);
        
        // Calculate vibrant (saturated version)
        const max = Math.max(r, g, b);
        const vibrantR = r === max ? Math.min(255, r * 1.3) : r;
        const vibrantG = g === max ? Math.min(255, g * 1.3) : g;
        const vibrantB = b === max ? Math.min(255, b * 1.3) : b;
        
        // Calculate muted (desaturated version)
        const avg = (r + g + b) / 3;
        const mutedR = Math.floor((r + avg) / 2);
        const mutedG = Math.floor((g + avg) / 2);
        const mutedB = Math.floor((b + avg) / 2);
        
        setColors({
          dominant: `rgb(${r}, ${g}, ${b})`,
          vibrant: `rgb(${Math.floor(vibrantR)}, ${Math.floor(vibrantG)}, ${Math.floor(vibrantB)})`,
          muted: `rgb(${mutedR}, ${mutedG}, ${mutedB})`,
        });
      } catch (error) {
        console.error("Error extracting colors:", error);
      }
    };
    
    img.onerror = () => {
      console.error("Failed to load image for color extraction");
    };
  }, [imageUrl]);

  return colors;
};