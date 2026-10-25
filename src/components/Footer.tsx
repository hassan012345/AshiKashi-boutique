import React, { useState } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
  onOpenMeasurements: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenMeasurements }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#FAF9F6] border-t border-[#E6E0D6] text-xs text-[#57534E]">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-[#EAE5DD]">
          
          {/* Brand info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="font-serif text-2xl tracking-wider text-[#1A1A1A]">
              AURELIA COUTURE
            </div>
            <p className="text-xs text-[#6B655F] leading-relaxed max-w-sm font-light">
              Premium custom cloth stitching and bespoke dressmaking for Pakistani women. Individual paper patterns, doorstep Master Darzi fittings, unstitched brand suit replication, and artisanal hand adda embroidery.
            </p>
            <div className="text-[11px] text-[#78716C] space-y-1">
              <div>Lahore Studio: 12-C/1 M.M. Alam Road, Gulberg III, Lahore</div>
              <div>Karachi Atelier: 8-C Main 26th Street, Phase V, DHA, Karachi</div>
              <div>Islamabad Lounge: Beverly Centre, Jinnah Avenue, Blue Area, Islamabad</div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <div className="font-semibold text-[#1A1A1A] uppercase tracking-wider text-[11px]">
              Tailoring Services
            </div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('studio')} className="hover:text-[#1A1A1A] transition-colors">
                  Custom Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('lookbook')} className="hover:text-[#1A1A1A] transition-colors">
                  Festive Lookbook
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('fabrics')} className="hover:text-[#1A1A1A] transition-colors">
                  Fabric Vault (PKR/m)
                </button>
              </li>
              <li>
                <button onClick={onOpenMeasurements} className="hover:text-[#1A1A1A] transition-colors">
                  Measurement Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tracker')} className="hover:text-[#1A1A1A] transition-colors">
                  Live Order Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Garment Categories */}
          <div className="lg:col-span-2 space-y-3">
            <div className="font-semibold text-[#1A1A1A] uppercase tracking-wider text-[11px]">
              Pakistani Silhouettes
            </div>
            <ul className="space-y-2 text-[#6B655F]">
              <li>Shalwar Kameez & Patiala</li>
              <li>32-Kali Kalidar Anarkali Frocks</li>
              <li>Floor Bridal Maxis & Gowns</li>
              <li>Angrakha & Flared Ghararas</li>
              <li>Banarasi Saree Blouses</li>
              <li>Kurti & Cigarette Pants</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <div className="font-semibold text-[#1A1A1A] uppercase tracking-wider text-[11px]">
              Festive Drops & Pure Silk Arrivals
            </div>
            <p className="text-xs text-[#6B655F] leading-relaxed">
              Get notified when seasonal pure 80g raw silk bolts, French chantilly lace borders, and Eid slot bookings open.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or WhatsApp number"
                  className="flex-1 p-2.5 bg-white border border-[#D5CBBF] rounded-sm text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#38332E] transition-colors shrink-0"
                >
                  Join
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Welcome to the Aurelia Couture VIP circle.</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar: Clean quiet copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#78716C]">
          <div>
            © {new Date().getFullYear()} Aurelia Couture Pakistan. All custom garment patterns preserved under client profile.
          </div>
          <div className="flex items-center gap-6">
            <span>Cash on Delivery (COD) & Online Bank Transfer Available</span>
            <span>·</span>
            <span>Free Doorstep Rider Pickup & Delivery Nationwide</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
