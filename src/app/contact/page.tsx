import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Contact() {
  return (
    <div className="bg-black min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Get In Touch
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Want to connect with the Bourbon Budz crew? Whether you have bourbon recommendations, 
            want to share your story, or just want to say hello, we'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="bourbon">Bourbon Recommendation</option>
                  <option value="podcast">Podcast Topic Suggestion</option>
                  <option value="guest">Guest Appearance</option>
                  <option value="music">Music & THEM GUYS</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors resize-vertical"
                  placeholder="Tell us what's on your mind..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <EnvelopeIcon className="w-6 h-6 text-red-400 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Podcast Inquiries</h3>
                    <p className="text-red-400 mb-1">podcast@bourbonbudz.net</p>
                    <p className="text-gray-400 text-sm">Episode suggestions, guest requests, listener feedback</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <EnvelopeIcon className="w-6 h-6 text-red-400 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Bourbon & Reviews</h3>
                    <p className="text-red-400 mb-1">bourbon@bourbonbudz.net</p>
                    <p className="text-gray-400 text-sm">Bourbon recommendations, distillery partnerships, review requests</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <EnvelopeIcon className="w-6 h-6 text-red-400 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Business Partnerships</h3>
                    <p className="text-red-400 mb-1">partnerships@bourbonbudz.net</p>
                    <p className="text-gray-400 text-sm">Sponsorship opportunities, collaborations, business inquiries</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <EnvelopeIcon className="w-6 h-6 text-red-400 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Shop & Orders</h3>
                    <p className="text-red-400 mb-1">shop@bourbonbudz.net</p>
                    <p className="text-gray-400 text-sm">Store inquiries, order support, product questions</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPinIcon className="w-6 h-6 text-red-400 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Location</h3>
                    <p className="text-gray-400">
                      South Louisiana<br />
                      Home of THEM GUYS
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-6 h-6 text-red-400 mt-1 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                  <div>
                    <h3 className="text-white font-medium mb-1">Listen to THEM GUYS</h3>
                    <a href="https://open.spotify.com/artist/2NSjPg24ASoVFbXXhfWxxi" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 transition-colors">
                      Spotify
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
              <h3 className="text-xl font-bold text-white mb-4">Recording Schedule</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex justify-between">
                  <span>Recording Days</span>
                  <span>Flexible</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Time</span>
                  <span>1-3 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Live Shows</span>
                  <span>Check THEM GUYS schedule</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
              <h3 className="text-xl font-bold text-white mb-4">Connect With Us</h3>
              <p className="text-gray-400 mb-4">
                Follow Bourbon Budz and check out THEM GUYS on social media for music updates, 
                bourbon content, and behind-the-scenes moments.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.youtube.com/channel/UCiXi6CNVAYkpcsdgufRc5xg" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors">
                  <span className="sr-only">YouTube (THEM GUYS)</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a href="https://open.spotify.com/artist/2NSjPg24ASoVFbXXhfWxxi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors">
                  <span className="sr-only">Spotify (THEM GUYS)</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/them_guysofficial" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors">
                  <span className="sr-only">Instagram (THEM GUYS)</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.017 0C8.396 0 7.989.013 7.041.072 6.096.13 5.432.333 4.865.63c-.653.36-1.308.895-1.828 1.414-.52.52-.955 1.175-1.315 1.828-.297.567-.5 1.231-.559 2.176C1.104 7.996 1.091 8.403 1.091 12.017s.013 4.021.072 4.969c.059.945.262 1.609.559 2.176.36.653.795 1.308 1.315 1.828.52.52 1.175.955 1.828 1.315.567.297 1.231.5 2.176.559.948.059 1.355.072 4.969.072s4.021-.013 4.969-.072c.945-.059 1.609-.262 2.176-.559.653-.36 1.308-.795 1.828-1.315.52-.52.955-1.175 1.315-1.828.297-.567.5-1.231.559-2.176.059-.948.072-1.355.072-4.969s-.013-4.021-.072-4.969c-.059-.945-.262-1.609-.559-2.176-.36-.653-.795-1.308-1.315-1.828-.52-.52-1.175-.955-1.828-1.315-.567-.297-1.231-.5-2.176-.559C16.038.013 15.631 0 12.017 0zM12.017 2.16c3.549 0 3.97.013 5.378.072.798.036 1.232.166 1.52.276.382.148.655.326.942.613.287.287.465.56.613.942.11.288.24.722.276 1.52.059 1.408.072 1.829.072 5.378s-.013 3.97-.072 5.378c-.036.798-.166 1.232-.276 1.52a2.54 2.54 0 0 1-.613.942 2.54 2.54 0 0 1-.942.613c-.288.11-.722.24-1.52.276-1.408.059-1.829.072-5.378.072s-3.97-.013-5.378-.072c-.798-.036-1.232-.166-1.52-.276a2.54 2.54 0 0 1-.942-.613 2.54 2.54 0 0 1-.613-.942c-.11-.288-.24-.722-.276-1.52-.059-1.408-.072-1.829-.072-5.378s.013-3.97.072-5.378c.036-.798.166-1.232.276-1.52.148-.382.326-.655.613-.942.287-.287.56-.465.942-.613.288-.11.722-.24 1.52-.276 1.408-.059 1.829-.072 5.378-.072z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M12.017 15.785a3.768 3.768 0 1 1 0-7.536 3.768 3.768 0 0 1 0 7.536zM12.017 5.839a6.178 6.178 0 1 0 0 12.356 6.178 6.178 0 0 0 0-12.356zM19.604 5.593a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/112472836853445" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors">
                  <span className="sr-only">Facebook (THEM GUYS)</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
