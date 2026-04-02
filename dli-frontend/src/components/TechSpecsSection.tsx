'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface TechSpecsProps {
  onCatalogue: () => void;
}

export default function TechSpecsSection({ onCatalogue }: TechSpecsProps) {
  const specs = [
    {
      num: "01",
      title: "ROLE-BASED ACCESS CONTROL (RBAC)",
      description: "Granular permission management for both enterprise and individual learners, ensuring secure access to specialized curriculum.",
      size: "col-span-1 lg:col-span-2"
    },
    {
      num: "02",
      title: "STATELESS JWT AUTHENTICATION",
      description: "Highly scalable session management engineered for zero-latency performance across our distributed infrastructure.",
      size: "col-span-1"
    },
    {
      num: "03",
      title: "DLI POINTS REDEMPTION ENGINE",
      description: "Real-time reward processing and automated course enrollment verification system for a seamless progress ecosystem.",
      size: "col-span-1"
    },
    {
      num: "04",
      title: "STRICT DATA SCHEMA VALIDATION",
      description: "Ensuring data integrity and system security through robust server-side validation and Zod schema enforcement.",
      size: "col-span-1 lg:col-span-2"
    }
  ];

  return (
    <section className="relative z-10 bg-black py-32 border-t border-primary/20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-20 space-y-4">
          <h2 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tighter uppercase">
            System <span className="text-primary italic">Specifications</span>
          </h2>
          <div className="w-24 h-1 bg-primary"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
          {specs.map((spec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`${spec.size} group relative p-10 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500`}
            >
              <div className="absolute inset-0 bg-radial-gradient from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10">
                <span className="block text-6xl md:text-8xl font-headline font-bold text-white mb-8 tracking-tighter leading-none transition-colors duration-500">
                  {spec.num}
                </span>
                <h3 className="text-primary font-bold text-2xl mb-4 font-headline uppercase tracking-tighter">
                  {spec.title}
                </h3>
                <p className="text-white/50 leading-relaxed text-lg font-light max-w-xl">
                  {spec.description}
                </p>
              </div>

              {spec.size.includes('lg:col-span-2') && (
                <div className="absolute top-1/2 -right-10 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors duration-500" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <Button 
            size="lg" 
            variant="outline"
            onClick={onCatalogue}
            className="border-primary/30 text-primary hover:bg-primary hover:text-white font-bold px-16 h-16 text-xl rounded-none transition-all duration-500 uppercase tracking-tighter"
          >
            Browse Course Catalogue
          </Button>
        </div>
      </div>
    </section>
  );
}
