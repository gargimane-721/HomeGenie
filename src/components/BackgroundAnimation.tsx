import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  color: string;
  type: 'sparkle' | 'cross' | 'pulsar' | 'dot' | 'stardust';
  sparkleSize: number;
  rotation: number;
  rotationSpeed: number;
  vx: number;
  vy: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
  size: number;
  color: string;
  trail: Array<{ x: number; y: number; alpha: number; size: number }>;
  sparks: Array<{ x: number; y: number; vx: number; vy: number; alpha: number; size: number }>;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initStars();
    };

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let isHovering = false;

    const handleResize = () => {
      resizeCanvas();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      isHovering = true;
    };

    const handleMouseLeave = () => {
      isHovering = false;
    };

    const ripples: Ripple[] = [];

    const handleClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 180,
        alpha: 0.6,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    // Architectural deep slate, platinum, and charcoal palette for high-contrast starry nodes
    const primaryStarColors = [
      '#0F172A', // slate-900 (deepest)
      '#1E293B', // slate-800
      '#334155', // slate-700
      '#E2E8F0', // slate-200 (glowing silver)
      '#F1F5F9', // slate-100 (crisp star)
      '#CBD5E1', // slate-300
    ];

    const accentStarColors = [
      '#FFFFFF', // pure diamond white
      '#F8FAFC', // platinum
      '#0F172A', // rich dark slate
      '#E2E8F0', // bright star
    ];

    let stars: Star[] = [];

    const initStars = () => {
      // Denser, rich star field for captivating starry night aesthetic
      const numStars = Math.min(260, Math.max(120, Math.floor((width * height) / 5500)));
      stars = [];

      for (let i = 0; i < numStars; i++) {
        const z = Math.random() * 0.85 + 0.15;
        const randType = Math.random();
        let type: Star['type'] = 'dot';
        if (randType < 0.12) {
          type = 'sparkle'; // 4-point diamond star
        } else if (randType < 0.22) {
          type = 'cross'; // 8-point diffraction star
        } else if (randType < 0.38) {
          type = 'pulsar'; // glowing breathing pulsar
        } else if (randType < 0.55) {
          type = 'stardust'; // drifting micro particle
        }

        const isSpecial = type !== 'dot' && type !== 'stardust';
        const color = isSpecial
          ? accentStarColors[Math.floor(Math.random() * accentStarColors.length)]
          : primaryStarColors[Math.floor(Math.random() * primaryStarColors.length)];

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          size:
            type === 'cross'
              ? Math.random() * 1.8 + 1.4
              : type === 'sparkle'
              ? Math.random() * 1.6 + 1.2
              : type === 'pulsar'
              ? Math.random() * 1.4 + 1.0
              : type === 'stardust'
              ? Math.random() * 0.8 + 0.4
              : Math.random() * 1.2 + 0.6,
          baseAlpha: isSpecial ? Math.random() * 0.4 + 0.45 : Math.random() * 0.35 + 0.25,
          twinkleSpeed: Math.random() * 0.04 + 0.015,
          phase: Math.random() * Math.PI * 2,
          color,
          type,
          sparkleSize:
            type === 'cross'
              ? Math.random() * 6 + 5
              : type === 'sparkle'
              ? Math.random() * 4.5 + 3.5
              : Math.random() * 3 + 2,
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          vx: (Math.random() - 0.5) * 0.12 * (type === 'stardust' ? 1.4 : z),
          vy: (Math.random() - 0.5) * 0.12 * (type === 'stardust' ? 1.4 : z),
        });
      }
    };

    resizeCanvas();

    const shootingStars: ShootingStar[] = [];
    const maxShootingStars = 3;

    const createShootingStar = () => {
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
      const startX = Math.random() * (width * 0.9) + width * 0.05;
      const startY = Math.random() * (height * 0.45);
      const speed = Math.random() * 8 + 10;
      const length = Math.random() * 80 + 60;

      shootingStars.push({
        x: startX,
        y: startY,
        length,
        speed,
        angle,
        opacity: 0.95,
        active: true,
        size: Math.random() * 1.5 + 1.5,
        color: '#F8FAFC',
        trail: [],
        sparks: [],
      });
    };

    let lastShootingStarTime = Date.now();
    let nextShootingStarDelay = Math.random() * 3200 + 2000;

    let time = 0;

    const render = () => {
      time += 0.02;

      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;
      const mouseOffsetX = (mouseX - width / 2) * 0.015;
      const mouseOffsetY = (mouseY - height / 2) * 0.015;

      ctx.clearRect(0, 0, width, height);

      // 1-Shade Lighter Slate Gray Backdrop (#64748B to #4B5563)
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#64748B'); // Slate-500
      bgGrad.addColorStop(0.5, '#6B7280'); // Gray-500 (1 shade lighter)
      bgGrad.addColorStop(1, '#4B5563'); // Gray-600
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Deep atmospheric cosmic clouds
      const nebula1 = ctx.createRadialGradient(
        width * 0.75 + Math.sin(time * 0.15) * 35,
        height * 0.25 + Math.cos(time * 0.12) * 30,
        50,
        width * 0.75,
        height * 0.25,
        550
      );
      nebula1.addColorStop(0, 'rgba(51, 65, 85, 0.40)');
      nebula1.addColorStop(0.6, 'rgba(71, 85, 105, 0.22)');
      nebula1.addColorStop(1, 'rgba(107, 114, 128, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(
        width * 0.2 + Math.cos(time * 0.18) * 40,
        height * 0.75 + Math.sin(time * 0.14) * 35,
        60,
        width * 0.2,
        height * 0.75,
        600
      );
      nebula2.addColorStop(0, 'rgba(30, 41, 59, 0.38)');
      nebula2.addColorStop(0.7, 'rgba(71, 85, 105, 0.18)');
      nebula2.addColorStop(1, 'rgba(107, 114, 128, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // Render interactive click ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += 2.5;
        rip.alpha -= 0.012;

        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
          ripples.splice(r, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = `rgba(15, 23, 42, ${rip.alpha * 0.35})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(51, 65, 85, ${rip.alpha * 0.2})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius * 0.65, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Constellation Connecting Lines & Dynamic Proximity Links
      const maxConnectDist = 95;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const s1 = stars[i];
          const s2 = stars[j];

          const p1X = s1.x + mouseOffsetX * s1.z;
          const p1Y = s1.y + mouseOffsetY * s1.z;
          const p2X = s2.x + mouseOffsetX * s2.z;
          const p2Y = s2.y + mouseOffsetY * s2.z;

          const dx = p1X - p2X;
          const dy = p1Y - p2Y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            // Check mouse proximity to illuminate geometric constellation web
            let mouseBoost = 0;
            if (isHovering) {
              const midX = (p1X + p2X) / 2;
              const midY = (p1Y + p2Y) / 2;
              const distToMouse = Math.sqrt((midX - mouseX) ** 2 + (midY - mouseY) ** 2);
              if (distToMouse < 140) {
                mouseBoost = (1 - distToMouse / 140) * 0.22;
              }
            }

            const lineAlpha = (1 - dist / maxConnectDist) * 0.12 * (s1.z + s2.z) * 0.5 + mouseBoost;
            ctx.strokeStyle = `rgba(15, 23, 42, ${lineAlpha})`;
            ctx.lineWidth = mouseBoost > 0 ? 0.9 : 0.5;
            ctx.beginPath();
            ctx.moveTo(p1X, p1Y);
            ctx.lineTo(p2X, p2Y);
            ctx.stroke();
          }
        }
      }

      // Draw Twinkling Stars, Sparkles, Crosses & Pulsars
      stars.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;
        star.rotation += star.rotationSpeed;

        if (star.x < -20) star.x = width + 20;
        if (star.x > width + 20) star.x = -20;
        if (star.y < -20) star.y = height + 20;
        if (star.y > height + 20) star.y = -20;

        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.phase);
        let currentAlpha = Math.max(0.15, Math.min(0.95, star.baseAlpha + twinkle * 0.35));

        const renderX = star.x + mouseOffsetX * star.z;
        const renderY = star.y + mouseOffsetY * star.z;

        // Proximity flare when mouse passes by
        if (isHovering) {
          const distToMouse = Math.sqrt((renderX - mouseX) ** 2 + (renderY - mouseY) ** 2);
          if (distToMouse < 100) {
            const proximityFactor = 1 - distToMouse / 100;
            currentAlpha = Math.min(1.0, currentAlpha + proximityFactor * 0.45);
          }
        }

        ctx.save();
        ctx.translate(renderX, renderY);

        if (star.type === 'cross') {
          // 8-pointed shimmering architectural diamond star
          ctx.rotate(star.rotation);
          const spkSize = star.sparkleSize * (0.85 + twinkle * 0.3);
          const diagSize = spkSize * 0.55;

          // Soft radiant aura halo
          const haloGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, spkSize * 1.4);
          haloGrad.addColorStop(0, `rgba(15, 23, 42, ${currentAlpha * 0.35})`);
          haloGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(0, 0, spkSize * 1.4, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = star.color;
          ctx.lineWidth = 1.0;
          ctx.globalAlpha = currentAlpha * 0.9;

          // Primary cross
          ctx.beginPath();
          ctx.moveTo(0, -spkSize);
          ctx.lineTo(0, spkSize);
          ctx.moveTo(-spkSize, 0);
          ctx.lineTo(spkSize, 0);
          ctx.stroke();

          // Diagonal cross
          ctx.lineWidth = 0.6;
          ctx.globalAlpha = currentAlpha * 0.6;
          ctx.beginPath();
          ctx.moveTo(-diagSize, -diagSize);
          ctx.lineTo(diagSize, diagSize);
          ctx.moveTo(diagSize, -diagSize);
          ctx.lineTo(-diagSize, diagSize);
          ctx.stroke();

          // Core bright node
          ctx.fillStyle = '#020617';
          ctx.globalAlpha = Math.min(1.0, currentAlpha * 1.2);
          ctx.beginPath();
          ctx.arc(0, 0, star.size * 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (star.type === 'sparkle') {
          // 4-pointed diamond sparkle
          ctx.rotate(star.rotation);
          const spkSize = star.sparkleSize * (0.8 + twinkle * 0.3);

          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.9;
          ctx.globalAlpha = currentAlpha * 0.85;

          ctx.beginPath();
          ctx.moveTo(0, -spkSize);
          ctx.lineTo(0, spkSize);
          ctx.moveTo(-spkSize, 0);
          ctx.lineTo(spkSize, 0);
          ctx.stroke();

          ctx.fillStyle = star.color;
          ctx.globalAlpha = currentAlpha;
          ctx.beginPath();
          ctx.arc(0, 0, star.size * 1.1, 0, Math.PI * 2);
          ctx.fill();
        } else if (star.type === 'pulsar') {
          // Breathing pulsar with outer pulse halo
          const pulseRadius = star.size * (1.6 + twinkle * 0.6);
          ctx.fillStyle = `rgba(15, 23, 42, ${currentAlpha * 0.25})`;
          ctx.beginPath();
          ctx.arc(0, 0, pulseRadius * 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = star.color;
          ctx.globalAlpha = currentAlpha;
          ctx.beginPath();
          ctx.arc(0, 0, star.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (star.type === 'stardust') {
          // Micro drifting cosmic particle
          ctx.fillStyle = star.color;
          ctx.globalAlpha = currentAlpha * 0.7;
          ctx.beginPath();
          ctx.arc(0, 0, star.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Crisp standard star
          ctx.fillStyle = star.color;
          ctx.globalAlpha = currentAlpha;
          ctx.beginPath();
          ctx.arc(0, 0, star.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // Spawn Shooting Stars
      const now = Date.now();
      if (now - lastShootingStarTime > nextShootingStarDelay && shootingStars.length < maxShootingStars) {
        createShootingStar();
        // Occasionally spawn twin shooting stars for extra visual delight
        if (Math.random() < 0.35) {
          setTimeout(() => createShootingStar(), 250);
        }
        lastShootingStarTime = now;
        nextShootingStarDelay = Math.random() * 3600 + 2200;
      }

      // Render shooting stars & fiery particle trails
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];

        s.trail.unshift({ x: s.x, y: s.y, alpha: s.opacity, size: s.size });
        if (s.trail.length > 24) s.trail.pop();

        // Spawn tiny sparks behind head
        if (Math.random() < 0.65) {
          s.sparks.push({
            x: s.x + (Math.random() - 0.5) * 4,
            y: s.y + (Math.random() - 0.5) * 4,
            vx: -Math.cos(s.angle) * (Math.random() * 2 + 1) + (Math.random() - 0.5) * 1.5,
            vy: -Math.sin(s.angle) * (Math.random() * 2 + 1) + (Math.random() - 0.5) * 1.5,
            alpha: s.opacity * 0.8,
            size: Math.random() * 1.2 + 0.6,
          });
        }

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.018;

        // Render trailing sparks
        for (let sp = s.sparks.length - 1; sp >= 0; sp--) {
          const spark = s.sparks[sp];
          spark.x += spark.vx;
          spark.y += spark.vy;
          spark.alpha -= 0.04;

          if (spark.alpha <= 0) {
            s.sparks.splice(sp, 1);
            continue;
          }

          ctx.fillStyle = `rgba(255, 255, 255, ${spark.alpha})`;
          ctx.beginPath();
          ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
          ctx.fill();
        }

        if (s.opacity <= 0 || s.x > width + 100 || s.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        // Render comet body and ionization trail
        if (s.trail.length > 1) {
          ctx.save();
          for (let t = 0; t < s.trail.length - 1; t++) {
            const p1 = s.trail[t];
            const p2 = s.trail[t + 1];
            const segRatio = 1 - t / s.trail.length;
            const segAlpha = segRatio * s.opacity * 0.85;

            ctx.strokeStyle = `rgba(248, 250, 252, ${segAlpha})`;
            ctx.lineWidth = Math.max(0.6, segRatio * s.size * 2);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }

          // Luminous comet head
          const headGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 4);
          headGrad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
          headGrad.addColorStop(0.5, `rgba(226, 232, 240, ${s.opacity * 0.7})`);
          headGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = headGrad;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = s.opacity;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 1.3, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};

