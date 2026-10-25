import React from 'react';
import { Scissors, Compass, ShieldCheck, HeartHandshake } from 'lucide-react';

export const CraftsmanshipStory: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 border-b border-[#E6E0D6] bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="text-xs uppercase tracking-[0.25em] text-[#7D5A44] font-medium">
            Atelier Principles & Heritage
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] leading-tight text-balance">
            The Architecture of Second-Skin Bespoke Stitching.
          </h2>
          <p className="text-base text-[#57534E] font-light leading-relaxed">
            Ready-to-wear fashion forces women into arbitrary standardized size numbers. Bespoke custom stitching reverses the paradigm: the garment is drafted entirely around the curves, asymmetry, and posture of your singular form.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-12 border-t border-[#EAE5DD]">
          
          <div className="space-y-3">
            <span className="font-serif text-3xl text-[#8C7A6B] block">01.</span>
            <h3 className="font-serif text-lg font-semibold text-[#1A1A1A]">
              Master Darzi Paper Patterns
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Every client receives a hand-drafted paper cutting sloper drafted to their exact posture, teera shoulder slope, and daman flair — archived for all your future unstitched suits.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-serif text-3xl text-[#8C7A6B] block">02.</span>
            <h3 className="font-serif text-lg font-semibold text-[#1A1A1A]">
              Pure Silk Thread & Piping
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              We sew exclusively with 100% color-fast pure silk thread, soft cotton malmal armhole lining, and hand-turned fabric piping on chaaks to eliminate scratchy polyester seams.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-serif text-3xl text-[#8C7A6B] block">03.</span>
            <h3 className="font-serif text-lg font-semibold text-[#1A1A1A]">
              2-Inch Alteration Margins
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Bodies naturally fluctuate between seasons. Every Aurelia stitched kameez, frock, and maxi incorporates a generous 2-inch inner side margin for seamless future alterations.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-serif text-3xl text-[#8C7A6B] block">04.</span>
            <h3 className="font-serif text-lg font-semibold text-[#1A1A1A]">
              Generational Adda Karigars
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Our tailoring atelier is staffed with senior master tailors and female zardozi artisans from Lahore's old Anarkali and Karachi's artisan guilds who receive fair living wages.
            </p>
          </div>

        </div>

        {/* Quote Block */}
        <div className="mt-16 p-8 bg-[#F4F1EA] border border-[#E6E0D6] rounded-sm max-w-4xl mx-auto text-center space-y-4">
          <blockquote className="font-serif text-lg sm:text-xl italic text-[#1A1A1A] max-w-2xl mx-auto leading-relaxed">
            "A well-cut kameez never pulls at the bust nor twists at the chaak; it sits like an effortless silhouette celebrating the wearer's grace."
          </blockquote>
          <div className="text-xs text-[#78716C] font-medium tracking-wider uppercase">
            Ustad Muhammad Rafiq · Head Master Tailor (42 Years Bespoke Cutting)
          </div>
        </div>

      </div>
    </section>
  );
};
