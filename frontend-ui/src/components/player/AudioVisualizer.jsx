import { useEffect, useRef } from "react";
import { usePlayerStore } from "../../store/usePlayerStore";
import { useAudioContext } from "../../contexts/AudioContext";

const AudioVisualizer = ({ type = "bars" }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const { isPlaying } = usePlayerStore();
  const { isInitialized, getAnalyserData } = useAudioContext();

  useEffect(() => {
    if (!isInitialized || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      if (!isPlaying) {
        // Draw static bars when paused
        drawStatic(ctx, canvas);
        return;
      }

      animationRef.current = requestAnimationFrame(draw);

      const dataArray = getAnalyserData();
      if (!dataArray) return;

      if (type === "bars") {
        drawBars(ctx, canvas, dataArray);
      } else if (type === "wave") {
        drawWave(ctx, canvas, dataArray);
      } else if (type === "circular") {
        drawCircular(ctx, canvas, dataArray);
      }
    };

    if (isPlaying) {
      draw();
    } else {
      drawStatic(ctx, canvas);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isInitialized, type, getAnalyserData]);

  const drawBars = (ctx, canvas, dataArray) => {
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Smaller bar width for more bars and denser look
    const barWidth = (width / dataArray.length) * 0.8;
    const barGap = 1;
    let barHeight;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      barHeight = (dataArray[i] / 255) * height * 0.8;

      // Add minimum height for better visual
      const minHeight = 2;
      barHeight = Math.max(barHeight, minHeight);

      const gradient = ctx.createLinearGradient(
        0,
        height,
        0,
        height - barHeight
      );
      gradient.addColorStop(0, "#1DB954");
      gradient.addColorStop(0.5, "#1ed760");
      gradient.addColorStop(1, "#4ade80");

      ctx.fillStyle = gradient;

      // Rounded top for bars
      ctx.beginPath();
      const radius = Math.min(barWidth / 2, 2);
      const barX = x;
      const barY = height - barHeight;

      ctx.moveTo(barX + radius, barY);
      ctx.lineTo(barX + barWidth - radius, barY);
      ctx.quadraticCurveTo(
        barX + barWidth,
        barY,
        barX + barWidth,
        barY + radius
      );
      ctx.lineTo(barX + barWidth, height);
      ctx.lineTo(barX, height);
      ctx.lineTo(barX, barY + radius);
      ctx.quadraticCurveTo(barX, barY, barX + radius, barY);
      ctx.closePath();
      ctx.fill();

      x += barWidth + barGap;
    }
  };

  const drawWave = (ctx, canvas, dataArray) => {
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Thicker line for better visibility
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Create gradient for the wave
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#1DB954");
    gradient.addColorStop(0.5, "#1ed760");
    gradient.addColorStop(1, "#4ade80");

    ctx.strokeStyle = gradient;
    ctx.beginPath();

    const sliceWidth = width / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 255.0;
      const y = height / 2 + (v * height) / 2 - height / 4;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        // Use quadratic curves for smoother wave
        const xMid = (x + (x - sliceWidth)) / 2;
        const prevY =
          height / 2 + ((dataArray[i - 1] / 255.0) * height) / 2 - height / 4;
        const cpX = xMid;
        const cpY = (prevY + y) / 2;
        ctx.quadraticCurveTo(cpX, prevY, x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();

    // Add glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(29, 185, 84, 0.5)";
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const drawCircular = (ctx, canvas, dataArray) => {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    ctx.clearRect(0, 0, width, height);

    // More bars for denser circular visualization
    const bars = 128;
    const step = Math.floor(dataArray.length / bars);

    for (let i = 0; i < bars; i++) {
      const value = dataArray[i * step] || 0;
      const barHeight = (value / 255) * radius * 0.8;
      const angle = (Math.PI * 2 * i) / bars;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight + 5);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight + 5);

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, "#1DB954");
      gradient.addColorStop(0.6, "#1ed760");
      gradient.addColorStop(1, "#4ade80");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2; // Thinner lines for more bars
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.9, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(29, 185, 84, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Add glow to outer edge
    const avgValue = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const glowRadius = radius + (avgValue / 255) * radius * 0.8;

    ctx.beginPath();
    ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(29, 185, 84, 0.1)";
    ctx.lineWidth = 20;
    ctx.stroke();
  };

  const drawStatic = (ctx, canvas, type) => {
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (type === "bars") {
      const barCount = 128; // More bars for static state too
      const barWidth = (width / barCount) * 0.8;
      const staticHeight = height * 0.05;

      for (let i = 0; i < barCount; i++) {
        ctx.fillStyle = "#2a2a2a";
        ctx.fillRect(
          i * (barWidth + 1),
          height - staticHeight,
          barWidth,
          staticHeight
        );
      }
    } else if (type === "wave") {
      ctx.strokeStyle = "#2a2a2a";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    } else if (type === "circular") {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 4;

      ctx.strokeStyle = "#2a2a2a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw static bars
      const bars = 128;
      for (let i = 0; i < bars; i++) {
        const angle = (Math.PI * 2 * i) / bars;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + 3);
        const y2 = centerY + Math.sin(angle) * (radius + 3);

        ctx.strokeStyle = "#2a2a2a";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={100}
      className="w-full h-full"
    />
  );
};

export default AudioVisualizer;
