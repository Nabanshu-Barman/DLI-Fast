
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useMotionValueEvent, useTransform } from 'framer-motion';

interface HeroProps {
  onLogin: () => void;
}

// Global Image Cache to prevent remount flickering/loading delays
const imageCache: HTMLImageElement[] = [];
const FRAME_COUNT = 240;

export default function HeroSection({ onLogin }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(imageCache.length === FRAME_COUNT);

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageCache[index]) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageCache[index];
    
    // Cover fill logic
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShiftX = (canvas.width - img.width * ratio) / 2;
    const centerShiftY = (canvas.height - img.height * ratio) / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
      centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform title movement: move up as we scroll
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 1, 0]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isLoaded) return;
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.floor(latest * FRAME_COUNT)
    );
    requestAnimationFrame(() => renderFrame(frameIndex));
  });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Re-render current frame on resize
        const currentProgress = scrollYProgress.get();
        const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(currentProgress * FRAME_COUNT));
        renderFrame(frameIndex);
      }
    };

    const preloadImages = async () => {
      if (imageCache.length === FRAME_COUNT) {
        setIsLoaded(true);
        handleResize(); // Initial draw from cache
        return;
      }

      const promises = [];
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const promise = new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          const frameIndex = String(i).padStart(3, '0');
          img.src = `/frames/ezgif-frame-${frameIndex}.jpg`;
          img.onload = () => resolve(img);
        });
        promises.push(promise);
      }

      const loadedImages = await Promise.all(promises);
      imageCache.push(...loadedImages);
      setIsLoaded(true);
      handleResize(); // Initial draw after loading
    };

    preloadImages();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section ref={containerRef} className="relative h-[600vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0 bg-black">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <motion.div
            style={{ y: titleY, opacity: titleOpacity }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="font-headline font-bold text-7xl md:text-9xl tracking-tighter text-white uppercase leading-none">
              F.A.S.T. <span className="text-primary italic">DLI</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mt-6 mx-auto font-light tracking-widest uppercase">
              Pushing the boundaries of <br /> Deep Learning education.
            </p>
            <div className="mt-12">
              <Button 
                size="lg" 
                onClick={onLogin} 
                className="bg-primary hover:bg-primary/90 text-white font-bold px-16 h-16 text-xl btn-nvidia-glow rounded-none uppercase tracking-tighter transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
