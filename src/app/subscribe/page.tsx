import { CheckIcon } from '@heroicons/react/24/outline';

const platforms = [
  {
    name: "Spotify",
    description: "Listen on the world's most popular music streaming platform",
    url: "#",
    icon: "🎵",
    color: "bg-green-600 hover:bg-green-700",
  },
  {
    name: "Apple Podcasts",
    description: "Available on Apple Podcasts for iOS and Mac users",
    url: "#",
    icon: "🎧",
    color: "bg-gray-800 hover:bg-gray-900",
  },
  {
    name: "YouTube",
    description: "Watch video episodes and behind-the-scenes content",
    url: "#",
    icon: "📺",
    color: "bg-red-600 hover:bg-red-700",
  },
  {
    name: "Google Podcasts",
    description: "Stream episodes directly through Google Podcasts",
    url: "#",
    icon: "🔍",
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    name: "Amazon Music",
    description: "Listen with your Amazon Music subscription",
    url: "#",
    icon: "🛒",
    color: "bg-orange-600 hover:bg-orange-700",
  },
  {
    name: "RSS Feed",
    description: "Subscribe directly with your favorite podcast app",
    url: "#",
    icon: "📡",
    color: "bg-amber-600 hover:bg-amber-700",
  },
];

const benefits = [
  "Get notified when new episodes are released",
  "Access to exclusive bonus content and early releases",
  "Join our community of bourbon enthusiasts",
  "Receive special offers from our partner distilleries",
  "Behind-the-scenes content and bloopers",
  "Monthly bourbon recommendations and tasting notes",
];

export default function Subscribe() {
  return (
    <div className="bg-black min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Subscribe to Bourbon Budz
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Never miss an episode! Subscribe on your favorite platform and join our 
            growing community of bourbon enthusiasts.
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {platforms.map((platform, index) => (
            <a
              key={index}
              href={platform.url}
              className={`${platform.color} text-white rounded-lg p-6 transition-all duration-300 hover:transform hover:scale-105 block`}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{platform.icon}</div>
                <h3 className="text-xl font-bold mb-2">{platform.name}</h3>
                <p className="text-sm opacity-90">{platform.description}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Why Subscribe?</h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckIcon className="w-6 h-6 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-zinc-900 rounded-lg p-8 border border-amber-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Connected</h3>
            <p className="text-gray-400 mb-6">
              Join our newsletter for exclusive content, bourbon news, and special offers 
              from our partner distilleries.
            </p>
            <form className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="newsletter"
                  className="mt-1 h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-400">
                  I agree to receive email updates and special offers. You can unsubscribe at any time.
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Subscribe to Newsletter
              </button>
            </form>
          </div>
        </div>

        {/* Social Media */}
        <div className="text-center bg-zinc-900 rounded-lg p-8 border border-zinc-800">
          <h3 className="text-2xl font-bold text-white mb-4">Follow Us on Social Media</h3>
          <p className="text-gray-400 mb-6">
            Get daily bourbon content, live updates, and connect with fellow bourbon lovers.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.017 0C8.396 0 7.989.013 7.041.072 6.096.13 5.432.333 4.865.63c-.653.36-1.308.895-1.828 1.414-.52.52-.955 1.175-1.315 1.828-.297.567-.5 1.231-.559 2.176C1.104 7.996 1.091 8.403 1.091 12.017s.013 4.021.072 4.969c.059.945.262 1.609.559 2.176.36.653.795 1.308 1.315 1.828.52.52 1.175.955 1.828 1.315.567.297 1.231.5 2.176.559.948.059 1.355.072 4.969.072s4.021-.013 4.969-.072c.945-.059 1.609-.262 2.176-.559.653-.36 1.308-.795 1.828-1.315.52-.52.955-1.175 1.315-1.828.297-.567.5-1.231.559-2.176.059-.948.072-1.355.072-4.969s-.013-4.021-.072-4.969c-.059-.945-.262-1.609-.559-2.176-.36-.653-.795-1.308-1.315-1.828-.52-.52-1.175-.955-1.828-1.315-.567-.297-1.231-.5-2.176-.559C16.038.013 15.631 0 12.017 0zM12.017 2.16c3.549 0 3.97.013 5.378.072.798.036 1.232.166 1.52.276.382.148.655.326.942.613.287.287.465.56.613.942.11.288.24.722.276 1.52.059 1.408.072 1.829.072 5.378s-.013 3.97-.072 5.378c-.036.798-.166 1.232-.276 1.52a2.54 2.54 0 0 1-.613.942 2.54 2.54 0 0 1-.942.613c-.288.11-.722.24-1.52.276-1.408.059-1.829.072-5.378.072s-3.97-.013-5.378-.072c-.798-.036-1.232-.166-1.52-.276a2.54 2.54 0 0 1-.942-.613 2.54 2.54 0 0 1-.613-.942c-.11-.288-.24-.722-.276-1.52-.059-1.408-.072-1.829-.072-5.378s.013-3.97.072-5.378c.036-.798.166-1.232.276-1.52.148-.382.326-.655.613-.942.287-.287.56-.465.942-.613.288-.11.722-.24 1.52-.276 1.408-.059 1.829-.072 5.378-.072z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M12.017 15.785a3.768 3.768 0 1 1 0-7.536 3.768 3.768 0 0 1 0 7.536zM12.017 5.839a6.178 6.178 0 1 0 0 12.356 6.178 6.178 0 0 0 0-12.356zM19.604 5.593a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
