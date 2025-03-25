'use client';

import { ReactNode, useEffect, useRef } from "react"

interface Props {
  children: ReactNode;
}

export default function AnimatedGradientBackground({ children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const particleCount = 12;
    const colors = [
      'rgba(66, 99, 235, 0.2)',
      'rgba(79, 125, 242, 0.2)',
      'rgba(56, 103, 214, 0.15)',
    ];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 200 + 100;
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) {
          this.x = width;
        } else if (this.x > width) {
          this.x = 0;
        }

        if (this.y < 0) {
          this.y = height;
        } else if (this.y > height) {
          this.y = 0;
        }
      }

      draw() {
        if (!ctx) return;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.update();
        particle.draw();
      }

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    init();
    animate();

    return () => {

      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return(
    <div className="relative w-full min-h-screen flex justify-center items-center">
     <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10 opacity-70" aria-hidden="true" />
     {children}
    </div>)
}