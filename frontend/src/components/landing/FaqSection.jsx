import React, { useState } from "react";

export default function FaqSection() {
  const faqs = [
    {
      q: "What are the general patient visiting hours at City Care?",
      a: "Our visiting hours are from 09:00 AM to 01:00 PM in the morning session, and 04:00 PM to 08:00 PM in the evening. ICU visitors require special medical approval cards."
    },
    {
      q: "Does City Care support health insurance coverage?",
      a: "Yes, we accept major national and private health insurance providers. Please coordinate with our receptionist desk or billing division upon checking in."
    },
    {
      q: "How can I book an emergency ambulance?",
      a: "You can call our 24/7 rapid emergency helpline at +1 (555) 019-911. Our trauma dispatch team is online at all times."
    },
    {
      q: "Can I manage my appointment booking online?",
      a: "Yes. You can book online right here. If you need to cancel or update slot schedules, you can reach our frontdesk receptionists who will process it instantly."
    }
  ];

  const [openIdx, setOpenIdx] = useState(null);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Help Desk</span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 font-semibold text-sm sm:text-base text-gray-800 flex items-center justify-between hover:bg-gray-50/50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-xl text-teal-600 font-bold">
                    {isOpen ? "\u2212" : "\u002B"}
                  </span>
                </button>
                
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-gray-500 leading-relaxed border-t border-gray-55/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
