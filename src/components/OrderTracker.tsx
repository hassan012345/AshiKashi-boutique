import React, { useState } from 'react';
import { SAMPLE_ORDERS } from '../data/atelierData';
import { OrderStatus } from '../types/stitching';
import { Search, CheckCircle2, Scissors, FileCheck } from 'lucide-react';

interface OrderTrackerProps {
  customOrders?: OrderStatus[];
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ customOrders = [] }) => {
  const [searchQuery, setSearchQuery] = useState('AUR-8921');
  const [activeOrder, setActiveOrder] = useState<OrderStatus | null>(SAMPLE_ORDERS['AUR-8921']);
  const [notFound, setNotFound] = useState(false);

  const allOrdersMap: Record<string, OrderStatus> = {
    ...SAMPLE_ORDERS,
    ...customOrders.reduce((acc, order) => {
      acc[order.orderId] = order;
      return acc;
    }, {} as Record<string, OrderStatus>)
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = searchQuery.trim().toUpperCase();
    if (allOrdersMap[cleanId]) {
      setActiveOrder(allOrdersMap[cleanId]);
      setNotFound(false);
    } else {
      setNotFound(true);
      setActiveOrder(null);
    }
  };

  return (
    <section id="tracker" className="py-16 lg:py-24 border-b border-[#E6E0D6] bg-[#FAF9F6]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-[0.25em] text-[#7D5A44] font-medium">
            Live Tailoring Status (سلائی کا سٹیٹس)
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A]">
            Bespoke Stitching Tracker
          </h2>
          <p className="text-sm text-[#57534E] font-light">
            Follow your custom suit through all stages—from paper sloper drafting and fabric grain alignment to Adda zardozi work and final cedar pressing.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-8 max-w-xl mx-auto space-y-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. AUR-8921)"
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#D5CBBF] rounded-sm text-sm text-[#1A1A1A] uppercase tracking-wider focus:border-[#1A1A1A] focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E] transition-colors shrink-0"
            >
              Track Order
            </button>
          </form>

          {/* Sample quick clicks */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#78716C]">
            <span>Try sample records:</span>
            <button
              onClick={() => { setSearchQuery('AUR-8921'); setActiveOrder(SAMPLE_ORDERS['AUR-8921']); setNotFound(false); }}
              className="font-mono text-[#7D5A44] hover:underline"
            >
              AUR-8921 (Lahore · Kalidar Frock)
            </button>
            <span>·</span>
            <button
              onClick={() => { setSearchQuery('AUR-9044'); setActiveOrder(SAMPLE_ORDERS['AUR-9044']); setNotFound(false); }}
              className="font-mono text-[#7D5A44] hover:underline"
            >
              AUR-9044 (Karachi · Shalwar Kameez)
            </button>
          </div>
        </div>

        {notFound && (
          <div className="mt-8 p-6 bg-white border border-[#E6E0D6] rounded-sm text-center text-xs text-[#78716C] max-w-md mx-auto">
            No order found with reference <strong>{searchQuery}</strong>. Please check your SMS confirmation or try a demo record above.
          </div>
        )}

        {/* Order Details & Progress Timeline */}
        {activeOrder && (
          <div className="mt-12 bg-white border border-[#E6E0D6] rounded-sm p-6 sm:p-8 space-y-8 shadow-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EAE5DD] gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1A1A1A]">
                    {activeOrder.garmentName}
                  </h3>
                  <span className="font-mono text-xs bg-[#EFECE6] text-[#1A1A1A] px-2.5 py-1 rounded-sm">
                    {activeOrder.orderId}
                  </span>
                </div>
                <div className="text-xs text-[#78716C] mt-1 flex items-center gap-3">
                  <span>Client: <strong>{activeOrder.clientName}</strong></span>
                  <span>·</span>
                  <span>Destination: {activeOrder.city}</span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-[11px] text-[#78716C] uppercase tracking-wider">Total Commission</div>
                <div className="font-serif text-lg font-bold text-[#7D5A44]">
                  PKR {activeOrder.totalAmountPKR.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#78716C]">Est. Completion: {activeOrder.targetCompletionDate}</div>
              </div>
            </div>

            {/* Timeline Stepper */}
            <div className="space-y-6">
              <h4 className="font-serif text-base font-semibold text-[#1A1A1A]">
                Craftsmanship Progression (سلائی کے مراحل)
              </h4>

              <div className="relative border-l-2 border-[#EAE5DD] ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8 py-2">
                {activeOrder.steps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div 
                      className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        step.completed
                          ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                          : step.current
                          ? 'bg-white border-[#7D5A44] text-[#7D5A44] ring-4 ring-[#EFECE6]'
                          : 'bg-[#FAF9F6] border-[#D5CBBF] text-[#A8998C]'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : step.current ? (
                        <Scissors className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-[11px] font-mono">{idx + 1}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className={`text-sm font-semibold ${step.current ? 'text-[#7D5A44]' : 'text-[#1A1A1A]'}`}>
                          {step.title}
                        </span>
                        {step.date && (
                          <span className="text-xs font-mono text-[#78716C]">
                            {step.date}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#57534E] leading-relaxed max-w-2xl">
                        {step.description}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Master Darzi's Log & Measurements Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-[#EAE5DD] text-xs">
              <div className="p-4 bg-[#FAF9F6] border border-[#E6E0D6] rounded-sm space-y-1.5">
                <div className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-[#7D5A44]" />
                  <span>Master Darzi's Baste Log</span>
                </div>
                <p className="text-[#57534E] leading-relaxed">
                  "{activeOrder.tailorNotes}"
                </p>
              </div>

              <div className="p-4 bg-[#FAF9F6] border border-[#E6E0D6] rounded-sm space-y-1.5">
                <div className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-[#7D5A44]" />
                  <span>Verified Specifications</span>
                </div>
                <div className="text-[#57534E] text-[11px] leading-relaxed">
                  <div><strong>Textile:</strong> {activeOrder.fabricUsed}</div>
                  <div><strong>Key Measurements:</strong> {activeOrder.measurementsSummary}</div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
