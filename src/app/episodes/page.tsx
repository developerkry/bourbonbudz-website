import { PlayIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import YouTubeEpisodes from '../components/YouTubeEpisodes';

const categories = ["All", "Distillery Visits", "Tastings", "Education", "Reviews", "Industry"];

export default function Episodes() {
  return (
    <div className="bg-black min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            All Episodes
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Dive deep into the world of bourbon with our comprehensive collection of episodes, 
            featuring distillery tours, tastings, and expert insights.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                category === "All"
                  ? "bg-red-500 text-white"
                  : "bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* YouTube Episodes Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">All Episodes from YouTube</h2>
          <YouTubeEpisodes />
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <a
            href="https://youtube.com/@bourbonbudz"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Visit Our YouTube Channel
          </a>
        </div>
      </div>
    </div>
  );
}
