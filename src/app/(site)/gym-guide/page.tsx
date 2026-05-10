"use client";
import React from 'react';
import Link from 'next/link';

// Mock data for static structure representation
const gymGuides = [
  {
    id: 1,
    title: "Beginner's Full Body Workout",
    category: "Beginner",
    duration: "4 Weeks",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
    description: "Start your fitness journey with this comprehensive full-body routine.",
  },
  {
    id: 2,
    title: "Advanced Hypertrophy Program",
    category: "Advanced",
    duration: "8 Weeks",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
    description: "Break through your plateaus and pack on serious muscle mass.",
  },
  {
    id: 3,
    title: "Core Core strength & Stability",
    category: "Intermediate",
    duration: "6 Weeks",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
    description: "Build a rock-solid core to improve posture and athletic performance.",
  },
  {
    id: 4,
    title: "Lean & Cut: Shred Program",
    category: "Intermediate",
    duration: "12 Weeks",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop",
    description: "High-intensity interval training mixed with targeted lifts for fat loss.",
  }
];

export default function GymGuidePage() {
  return (
    <div className="w-full min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop" 
            alt="Gym Guide Hero" 
            className="w-full h-full object-cover filter brightness-[0.4]"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6">
          <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-semibold uppercase tracking-wider shadow-lg">
            Expert Designed Plans
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-md">
            Transform Your Body With <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">BigNlean Guides</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-medium max-w-2xl text-shadow-sm">
            Whether you are just starting out or looking to break past plateaus, our curated workout regimes are tailored for your specific goals.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Programs</h2>
            <p className="text-gray-500 mt-2">Find the perfect workout plan tailored to your experience level.</p>
          </div>
          
          <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border border-gray-100">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((filter, i) => (
              <button 
                key={i}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  i === 0 
                  ? 'bg-black text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gymGuides.map((guide) => (
            <div 
              key={guide.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={guide.image} 
                  alt={guide.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-black text-xs font-bold uppercase tracking-wide rounded-full shadow-sm">
                    {guide.category}
                  </span>
                  <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wide rounded-full shadow-sm">
                    {guide.duration}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-500 transition-colors duration-300 line-clamp-2">
                  {guide.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                  {guide.description}
                </p>
                
                <div className="w-full pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <span className="text-sm font-semibold text-gray-900 border-b-2 border-transparent group-hover:border-red-500 transition-all duration-300 pb-1">
                    View Complete Guide
                  </span>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transform group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Banner */}
        <div className="mt-20 relative rounded-3xl overflow-hidden shadow-2xl bg-black">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
          <div className="relative z-10 px-6 py-12 md:py-16 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Need Personalized Coaching?
              </h2>
              <p className="text-gray-300 text-lg">
                Connect with our certified trainers to get a plan perfectly aligned with your body type and fitness goals.
              </p>
            </div>
            <button className="whitespace-nowrap px-8 py-4 bg-white text-black rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1 transition-all duration-300">
              Get Started Now
            </button>
          </div>
        </div>

      </section>
    </div>
  );
}
