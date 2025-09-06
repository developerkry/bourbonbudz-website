import Link from "next/link";
import { PlayIcon, CalendarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import LiveStatus from './components/LiveStatus';

export default function Home() {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-red-900/20">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-red-900/20 to-black opacity-80"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="text-red-400">Bourbon</span> Budz
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Your premier destination for bourbon knowledge, reviews, and community. 
            Join us as we explore the rich world of America's native spirit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/episodes"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center"
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              Listen Now
            </Link>
            <Link
              href="/shop"
              className="border border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center"
            >
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              Shop Merch
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Episodes */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Watch Our Episodes</h2>
            <p className="text-gray-400 text-lg">
              Discover the stories behind America's finest bourbons on our YouTube channel
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* YouTube Channel Showcase */}
            <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Bourbon Budz</h3>
                  <p className="text-gray-400">YouTube Channel</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Subscribe to our YouTube channel for weekly episodes, distillery tours, 
                bourbon tastings, and behind-the-scenes content.
              </p>
              <a
                href="https://youtube.com/@bourbonbudz"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                Visit YouTube Channel
              </a>
            </div>

            {/* Live Status Card */}
            <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
              <h3 className="text-xl font-bold text-white mb-6">Live Status</h3>
              <LiveStatus />
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/episodes"
              className="inline-flex items-center text-red-400 hover:text-red-300 font-semibold text-lg"
            >
              View All Episodes
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* After Dark Promotion */}
      <section className="py-20 bg-gradient-to-r from-red-950/40 via-black to-red-950/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <span className="text-4xl mr-3">🔥</span>
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                AFTER DARK
              </h2>
              <span className="text-4xl ml-3">🔥</span>
            </div>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Uncensored. Unfiltered. Unlimited. Experience bourbon like never before with our premium 
              subscription service where anything goes and everything's on the table.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-red-400 mb-8">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                <span className="font-bold">18+ ONLY</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                <span className="font-bold">NO CENSORSHIP</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                <span className="font-bold">EXCLUSIVE CONTENT</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/after-dark"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🔥 Explore After Dark
              </Link>
              <Link
                href="/after-dark"
                className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-4 px-8 rounded-lg transition-colors"
              >
                Watch Preview
              </Link>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              Starting at $9.99/month • Cancel anytime • Adults only
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">About Bourbon Budz</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                We're passionate bourbon enthusiasts sharing our love for America's native spirit. 
                From distillery tours to rare bottle reviews, we bring you authentic insights 
                into the bourbon world.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Whether you're a seasoned collector or just starting your bourbon journey, 
                our community welcomes all who appreciate the craft and culture of fine whiskey.
              </p>
              <Link
                href="/about"
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Learn More
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-red-900/30 to-zinc-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-16 h-16 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7V10C2 16.12 5.69 21.71 11.55 22.97L12 23L12.45 22.97C18.31 21.71 22 16.12 22 10V7L12 2M11 6H13V9H11V6M11 11H13V18H11V11Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Premium Quality</h3>
                  <p className="text-gray-400">Curated bourbon experiences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
