
'use client';

import React from 'react';

export default function AboutSection() {
  return (
    <section className="bg-black text-white py-32 border-t border-white/5 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-headline font-bold leading-tight">
              Engineering the <br />
              <span className="text-primary">Future of DLI.</span>
            </h2>
            <div className="w-24 h-1 bg-primary"></div>
          </div>
          
          <div className="space-y-8">
            <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light">
              FAST Club is dedicated to building scalable, secure, and performant web applications 
              with top-tier engineering practices. We bridge the gap between complex 
              AI infrastructures and intuitive user experiences.
            </p>
            <p className="text-lg text-white/50 leading-relaxed">
              Our platform serves as the central hub for the Deep Learning Institute's 
              points and progress ecosystem, ensuring every learner has the tools 
              needed to master the next generation of AI engineering through precise, 
              robustly engineered certification paths.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
