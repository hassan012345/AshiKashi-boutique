import React from 'react';
import { ArrowRight, Scissors, ShieldCheck, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onStartCustomizing: () => void;
  onExploreLookbook: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartCustomizing,
  onExploreLookbook
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#E6E0D6]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Headline & Narrative */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-[0.25em] text-[#7D5A44] font-medium">
                Pakistani Bespoke Women's Tailoring & Darzi Studio
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1A1A] leading-[1.12] tracking-tight text-balance">
                Couture Stitching Cut Exclusively to Your Proportions.
              </h1>
              <p className="text-base sm:text-lg text-[#57534E] leading-relaxed max-w-2xl font-light">
                From flowing Kalidar Frocks and regal Bridal Maxis to signature 3-Piece Shalwar Kameez and Angrakha Ghararas. Our master darzis draft individual paper patterns for every unique client. Send your unstitched suits from Khaadi, Maria.B, and Baroque, or commission from our pure 80g PK Raw Silk and Korean Bamber Chiffon vault.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onStartCustomizing}
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#38332E] transition-all rounded-sm shadow-sm whitespace-nowrap group"
              >
                <span>Design Custom Suit (سلائی کا آغاز)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreLookbook}
                className="inline-flex items-center justify-center px-7 py-3.5 border border-[#C5BBAF] text-[#1A1A1A] text-xs font-semibold tracking-wider uppercase hover:bg-[#EFECE6] transition-colors rounded-sm whitespace-nowrap"
              >
                Explore Festive Lookbook
              </button>
            </div>

            {/* Adjacent Proof Adjacency */}
            <div className="pt-6 border-t border-[#EAE5DD] grid grid-cols-3 gap-6 text-[#44403C]">
              <div>
                <div className="font-serif text-2xl text-[#1A1A1A] font-medium">100%</div>
                <div className="text-xs text-[#78716C] mt-0.5">Bespoke paper sloper per client</div>
              </div>
              <div>
                <div className="font-serif text-2xl text-[#1A1A1A] font-medium">48h</div>
                <div className="text-xs text-[#78716C] mt-0.5">Home Master Darzi visit in Lahore/Karachi</div>
              </div>
              <div>
                <div className="font-serif text-2xl text-[#1A1A1A] font-medium">COD</div>
                <div className="text-xs text-[#78716C] mt-0.5">Cash on Delivery across Pakistan</div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Atelier Photography & Tactile Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-sm shadow-xl bg-[#EFECE6]">
              <img
                src="/src/assets/images/hero_bespoke_atelier_1792879884417.jpg"
                alt="Aurelia custom tailoring atelier studio showing champagne silk draped on a dressmaker mannequin with tailor shears and sketches"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              {/* Single-Elevation Subtle Information Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#FAF9F6]/95 backdrop-blur-md border border-[#E6E0D6] rounded-sm text-xs text-[#292524] space-y-1">
                <div className="flex items-center justify-between text-[#1A1A1A] font-serif text-sm">
                  <span>Atelier No. 04 · Paris & London</span>
                  <span className="font-sans text-[11px] text-[#78716C] tracking-wider uppercase">Bespoke Guild</span>
                </div>
                <p className="text-[12px] text-[#57534E]">
                  Hand-basted canvas interlining · French-encased seams · Pure silk thread finish
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Full-Width 4-Column Atelier Service Strip */}
        <div className="mt-16 pt-10 border-t border-[#EAE5DD] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#EFECE6] flex items-center justify-center text-[#5B3E2B]">
              <Scissors className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#1A1A1A]">1. Individual Drafting</h3>
            <p className="text-xs text-[#6B655F] leading-relaxed">
              Every garment starts from a fresh paper block drawn to your precise anatomical measurements, not graded factory templates.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#EFECE6] flex items-center justify-center text-[#5B3E2B]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#1A1A1A]">2. BYOF or Curated Silks</h3>
            <p className="text-xs text-[#6B655F] leading-relaxed">
              Send your own heirloom fabric for custom stitching, or pick from our sustainable mulberry silk, raw silk, and Belgian linen library.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#EFECE6] flex items-center justify-center text-[#5B3E2B]">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#1A1A1A]">3. Doorstep Master Fitting</h3>
            <p className="text-xs text-[#6B655F] leading-relaxed">
              Book a certified master woman tailor to visit your home with swatches and tape, or submit your measurements with our interactive guide.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#EFECE6] flex items-center justify-center text-[#5B3E2B]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#1A1A1A]">4. Flawless Fit Guarantee</h3>
            <p className="text-xs text-[#6B655F] leading-relaxed">
              We engineer a generous 2-inch inner seam allowance. If any line does not drape like second skin, alterations are on us.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
