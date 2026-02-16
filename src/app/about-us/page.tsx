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
              Upleex is a modern rental marketplace that helps individuals and businesses access products on
              flexible terms. From home essentials to lifestyle and event needs, our goal is to make renting
              simple, affordable, and reliable.
            </p>
            <p>
              With a curated network of vendors and a customer-first experience, Upleex connects you to quality
              products without the burden of ownership. Whether you are setting up a new home, planning an
              event, or scaling your workspace, Upleex makes it easier to get what you need, when you need it.
            </p>
            <p>
              We focus on transparent pricing, doorstep delivery, and responsive support so that you can enjoy
              a seamless rental journey from start to finish.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-md px-6 md:px-10 py-6 md:py-8">
          <div className="border-b border-upleex-dark pb-3 mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gradient-primary">What Do We Offer</h2>
          </div>
          <div className="space-y-4 text-sm md:text-base text-slate-700 leading-relaxed">
            <p>
              At Upleex, we aim to build a hassle-free renting experience for both renters and partners. The
              platform focuses on:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-semibold text-upleex-purple">Wide Product Variety:</span> Choose from a range
                of lifestyle, home, and event products tailored to your needs.
              </li>
              <li>
                <span className="font-semibold text-upleex-purple">Verified Vendors Only:</span> Work with trusted
                partners who follow our quality and service standards.
              </li>
              <li>
                <span className="font-semibold text-upleex-purple">Doorstep Delivery & Pickup:</span> Get products
                delivered and picked up at your convenience.
              </li>
              <li>
                <span className="font-semibold text-upleex-purple">Flexible Rental Plans:</span> Short-term or
                long-term rentals with options that suit your budget.
              </li>
              <li>
                <span className="font-semibold text-upleex-purple">Customer Support:</span> Friendly assistance
                before and after booking to ensure a smooth experience.
              </li>
              <li>
                <span className="font-semibold text-upleex-purple">Transparent Pricing:</span> Clear costs with no
                hidden surprises.
              </li>
            </ul>
            <p className="font-semibold text-sm md:text-base text-upleex-purple mt-4">
              Join Upleex and experience a smarter way to rent.
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
                  <h3 className="text-lg md:text-xl font-bold text-slate-900">Gunjan Mathur</h3>
                  <p className="text-sm text-slate-600">Co-Founder at Upleex</p>
                </div>
                <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-1">
                  <li>Brings strong product and technology experience to the rental ecosystem.</li>
                  <li>Passionate about building customer-centric, scalable platforms.</li>
                  <li>Focuses on innovation and long-term value for customers and partners.</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md px-6 md:px-8 py-5 md:py-6 flex flex-col md:flex-row gap-4 md:gap-6 items-start">
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
