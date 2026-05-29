'use client';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-upleex-dark/5 py-10 md:py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-10 md:space-y-12">
        <section className="bg-white rounded-3xl shadow-md px-6 md:px-10 py-6 md:py-8">
          <div className="border-b border-upleex-dark pb-3 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">About Upleex</h1>
          </div>
          <div className="space-y-3 text-sm md:text-base leading-relaxed text-slate-700">
            <p>
             Upleex is a local rental marketplace built for India. It helps people find and list products in their
              own city without brokers. You can rent homes, rooms, office spaces, and daily-use items in a
              simple and trusted way.
            </p>
            <p>
              We connect owners and renters directly, so both sides save time and money. Whether you need
a product for a few days or a longer stay, Upleex makes the process fast, clear, and easy.
            </p>
            <p>
             We also focus on verified listings, local support, and flexible rental plans. That helps users enjoy
a smooth experience from search to booking.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-md px-6 md:px-10 py-6 md:py-8">
          <div className="border-b border-upleex-dark pb-3 mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gradient-primary">What Do We Offer</h2>
          </div>
          <div className="space-y-4 text-sm md:text-base text-slate-700 leading-relaxed">
            <p>
             At Upleex, we help users rent smarter and list faster. The platform is built for easy discovery,
direct communication, and trusted local deals.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-semibold text-upleex-purple">Wide Product Choice:</span> Find home appliances, electronics, furniture, vehicles, property,
fashion, services, education, kids products, and sports items.
              </li>
              <li>
                <span className="font-semibold text-upleex-purple">Verified Listings:</span>Vendors complete KYC before listing, which helps keep the platform
safe and reliable.
              </li>
              <li>
                <span className="font-semibold text-upleex-purple">Direct Local Access:</span> Connect with owners and renters in your area without middlemen.
              </li>
              <li>
                <span className="font-semibold text-upleex-purple">Flexible Rental Plans:</span>Choose the plan that fits your use, from short-term to long-term
needs.
              </li>
              <li>
                <span className="font-semibold text-upleex-purple">Easy Support:</span>Get help before and after booking for a smoother rental journey.
              </li>
              <li>
                <span className="font-semibold text-upleex-purple">Clear Pricing:</span> See simple plan details and avoid hidden surprises.
              </li>
            </ul>
            <p className="font-semibold text-sm md:text-base text-upleex-purple mt-4">
              Join Upleex and enjoy a smarter way to rent, list, and grow.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center text-2xl md:text-3xl font-bold text-gradient-primary mb-2">Meet Our Team</h2>
            <div className="h-px bg-upleex-dark/30 max-w-sm mx-auto" />
          </div>

          <div className="space-y-5 md:space-y-6">
            <div className="bg-white rounded-3xl shadow-md px-6 md:px-8 py-5 md:py-6 flex flex-col md:flex-row gap-4 md:gap-6 items-start">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-upleex-purple to-upleex-blue flex items-center justify-center text-white font-semibold text-lg md:text-xl shrink-0">
                GM
              </div>
              <div className="space-y-2">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900">Upleex</h3>
                  <p className="text-sm text-slate-600">Marketplace Lead at Upleex</p>
                </div>
                <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-1">
                  <li>Build a rental experience that feels simple and local.</li>
                  <li>Focuses on trust, speed, and ease for every user.</li>
                  <li>Helps owners and renters connect in a better way.</li>
                </ul>
              </div>
            </div>

            {/* <div className="bg-white rounded-3xl shadow-md px-6 md:px-8 py-5 md:py-6 flex flex-col md:flex-row gap-4 md:gap-6 items-start">
              <div className="order-2 md:order-1 space-y-2 flex-1">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900">Monali Mathur</h3>
                  <p className="text-sm text-slate-600">Co-Founder and CEO</p>
                </div>
                <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-1">
                  <li>Leads strategy, growth, and customer experience at Upleex.</li>
                  <li>Strong background in operations and business leadership.</li>
                  <li>Committed to building an efficient and delightful rental journey.</li>
                </ul>
              </div>
              <div className="order-1 md:order-2 w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-upleex-blue to-upleex-purple flex items-center justify-center text-white font-semibold text-lg md:text-xl shrink-0">
                MM
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md px-6 md:px-8 py-5 md:py-6 flex flex-col md:flex-row gap-4 md:gap-6 items-start">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-upleex-dark to-upleex-blue flex items-center justify-center text-white font-semibold text-lg md:text-xl shrink-0">
                NM
              </div>
              <div className="space-y-2">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900">Nitin Mathur</h3>
                  <p className="text-sm text-slate-600">Chief Strategy Officer</p>
                </div>
                <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-1">
                  <li>Drives partnerships, business expansion, and long-term strategy.</li>
                  <li>Brings deep experience across technology, operations, and finance.</li>
                  <li>Focused on sustainable growth and value creation for stakeholders.</li>
                </ul>
              </div>
            </div> */}
          </div>
        </section>
      </div>
    </div>
  );
}
