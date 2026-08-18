"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FirstOfferModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the offer cookie
    const hasSeenOffer = document.cookie.split('; ').find(row => row.startsWith('bignlean_first_offer_seen='));
    
    if (!hasSeenOffer) {
      // Delay opening slightly for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    // Set cookie for 7 days
    const d = new Date();
    d.setTime(d.getTime() + (7*24*60*60*1000));
    document.cookie = `bignlean_first_offer_seen=true;expires=${d.toUTCString()};path=/`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300"
      >
        {/* Close Button */}
        <button 
          onClick={closeModal}
          className="absolute top-3 right-3 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
        >
          <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="p-0">
          <div className="h-48 bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-4 left-6">
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-sm mb-2 inline-block">
                Limited Time
              </span>
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                Get 20% OFF
              </h2>
            </div>
          </div>
          
          <div className="p-6 text-center">
            <p className="text-gray-600 font-medium mb-6">
              Welcome to BigNlean! Grab this exclusive introductory offer. Use code <span className="font-bold text-black border-b-2 border-red-500">FIRST20</span> at checkout on your first order.
            </p>
            
            <button 
              onClick={closeModal}
              className="w-full py-4 text-white font-bold tracking-wide rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transform transition-all active:scale-[0.98] shadow-lg shadow-red-500/30"
            >
              Shop Now & Save
            </button>
            
            <button 
              onClick={closeModal}
              className="mt-4 text-xs font-medium text-gray-400 hover:text-gray-600 uppercase tracking-widest underline decoration-gray-300 underline-offset-4"
            >
              No thanks, I prefer paying full price
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
