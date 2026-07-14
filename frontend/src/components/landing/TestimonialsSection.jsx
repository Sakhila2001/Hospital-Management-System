import React from "react";

export default function TestimonialsSection() {
  const reviews = [
    {
      name: "Marcus Aurelius",
      treatment: "Bypass Heart Surgery",
      text: "The cardiology department at City Care saved my life. Dr. John Doe was professional, and the post-op nursing care was exceptionally warm and diligent.",
      rating: 5
    },
    {
      name: "Helen Troya",
      treatment: "Pediatric Care",
      text: "Booking a pediatric slot for my newborn was simple. Dr. Connor was extremely patient and guided us step-by-step through our child's vaccination roadmap.",
      rating: 5
    },
    {
      name: "Arthur Pendragon",
      treatment: "Neurological Consult",
      text: "Very advanced EEG monitoring facilities. The admin dashboard coordination was seamless, and the clinic schedule ran exactly on time.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-12">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Patient Reviews</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Real Stories from Our Patients
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Read positive feedback from individuals who received outstanding medical therapy and recovery support from City Care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {reviews.map((rev, idx) => (
            <div 
              key={idx} 
              className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* 5 Star Stars rating */}
                <div className="flex gap-1 text-yellow-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <span key={i} className="text-lg">&#9733;</span>
                  ))}
                </div>
                
                <p className="text-sm italic text-gray-600 leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              <div className="border-t border-gray-150 pt-3 mt-4">
                <h4 className="text-sm font-bold text-gray-800">{rev.name}</h4>
                <p className="text-xs text-teal-650 font-semibold">{rev.treatment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
