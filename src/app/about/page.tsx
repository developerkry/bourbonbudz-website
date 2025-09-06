'use client';

import { UserIcon, MicrophoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const team = [
  {
    name: "Chet Tabor",
    role: "Co-Host & Drummer of THEM GUYS",
    image: "https://img1.wsimg.com/isteam/ip/60e5f42f-f34d-4545-96e6-99591d5ab968/CHET%20SIGNED%20POSTER.png/:/cr=t:0.03%25,l:0%25,w:100%25,h:99.95%25/rs=w:600,h:800,cg:true",
    bio: "Chet brings his unique energy and 25+ years of drumming experience to Bourbon Budz. Known for his loud, passionate performances with THEM GUYS, he brings that same intensity to bourbon discussions and tastings.",
  },
  {
    name: "John Waguespack",
    role: "Co-Host & Bassist of THEM GUYS",
    image: "https://img1.wsimg.com/isteam/ip/60e5f42f-f34d-4545-96e6-99591d5ab968/JOHN%20SIGNED%20POSTER.png/:/cr=t:0.03%25,l:0%25,w:100%25,h:99.95%25/rs=w:600,h:800,cg:true",
    bio: "\"Johnny Utah\" serves as the backbone of both THEM GUYS and Bourbon Budz. His thunderous bass sound translates to deep knowledge and passion for bourbon culture, bringing infectious energy to every episode.",
  },
  {
    name: "Ayden Tabor",
    role: "Producer & Director",
    image: "/api/placeholder/200/200",
    bio: "Ayden handles all production and direction for Bourbon Budz, ensuring each episode delivers quality content and seamless audio-visual experience for our listeners.",
  },
];

const stats = [
  { label: "Band Albums", value: "3+" },
  { label: "Years of Music", value: "5+" },
  { label: "Bourbon Episodes", value: "Growing" },
  { label: "Louisiana Roots", value: "Deep" },
];

export default function About() {
  return (
    <div className="bg-black min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            About Bourbon Budz
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Join Chet Tabor and John Waguespack from the rock band THEM GUYS as they explore 
            the world of bourbon, bringing their signature energy and passion to every glass.
          </p>
        </div>

        {/* Our Story */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Bourbon Budz features Chet Tabor and John Waguespack, two passionate musicians from 
                  the Louisiana rock band THEM GUYS, who discovered their shared love for bourbon goes 
                  as deep as their musical partnership. What started as post-show conversations over 
                  whiskey evolved into a podcast that brings rock and roll energy to bourbon education.
                </p>
                <p>
                  Chet, with his 25+ years of drumming experience and signature high-energy style, 
                  brings that same passion to exploring bourbon culture. John "Johnny Utah" Waguespack, 
                  known as the thunderous backbone of THEM GUYS, serves as the foundation for 
                  thoughtful bourbon discussions and tastings.
                </p>
                <p>
                  Produced and directed by Ayden Tabor, Bourbon Budz combines the authentic 
                  camaraderie of lifelong friends with genuine appreciation for America's native spirit. 
                  From distillery stories to in-depth tastings, we bring you real conversations 
                  about bourbon from people who live and breathe passion in everything they do.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-red-900/30 to-zinc-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MicrophoneIcon className="w-24 h-24 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Since 2024</h3>
                  <p className="text-gray-400">Rock meets bourbon</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* What We Do */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900 rounded-lg p-8 text-center border border-zinc-800">
              <MicrophoneIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Podcast Episodes</h3>
              <p className="text-gray-400">
                Regular episodes featuring bourbon tastings, distillery stories, and conversations 
                that blend rock and roll energy with genuine appreciation for America's native spirit.
              </p>
            </div>
            <div className="bg-zinc-900 rounded-lg p-8 text-center border border-zinc-800">
              <UserIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Community Building</h3>
              <p className="text-gray-400">
                Building a community where music lovers and bourbon enthusiasts come together, 
                sharing experiences and learning from each other in an authentic, welcoming environment.
              </p>
            </div>
            <div className="bg-zinc-900 rounded-lg p-8 text-center border border-zinc-800">
              <GlobeAltIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Education & Reviews</h3>
              <p className="text-gray-400">
                Honest reviews and genuine reactions to bourbon releases, plus educational content 
                about production methods, delivered with the same authenticity we bring to our music.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Meet the Team</h2>
          
          {/* Main Hosts - Bigger Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {team.slice(0, 2).map((member, index) => (
              <div key={index} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                <div className="aspect-[4/5] bg-gradient-to-br from-red-900/20 to-zinc-800 flex items-center justify-center">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden flex items-center justify-center w-full h-full">
                    <UserIcon className="w-32 h-32 text-red-400" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-3">{member.name}</h3>
                  <p className="text-red-400 font-medium mb-6 text-lg">{member.role}</p>
                  <p className="text-gray-400 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Producer - Thin Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">{team[2].name}</h3>
              <p className="text-red-400 font-medium mb-3">{team[2].role}</p>
              <p className="text-gray-400 text-sm">{team[2].bio}</p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <div className="bg-zinc-900 rounded-lg p-12 border border-red-500/20">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-3">Authenticity</h3>
                <p className="text-gray-300">
                  Just like our music, our bourbon reviews are genuine and unfiltered. 
                  We share honest opinions and real reactions to every pour we taste.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-3">Passion</h3>
                <p className="text-gray-300">
                  Whether we're on stage with THEM GUYS or exploring bourbon, we bring 
                  the same level of energy and dedication to everything we do.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-3">Community</h3>
                <p className="text-gray-300">
                  We're building a family where music lovers and bourbon enthusiasts 
                  come together, sharing stories and creating lasting friendships.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-3">Fun</h3>
                <p className="text-gray-300">
                  Life's too short for boring conversations. We keep things entertaining 
                  while respecting the craft and culture of bourbon making.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Want to share your bourbon story, suggest a topic, or just say hello? 
            We'd love to hear from fellow bourbon enthusiasts and music lovers!
          </p>
          <a
            href="/contact"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block"
          >
            Contact Us
          </a>
        </section>
      </div>
    </div>
  );
}
