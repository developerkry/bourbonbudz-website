import Link from 'next/link';

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'Episodes', href: '/episodes' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
  social: [
    {
      name: 'Spotify',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      ),
    },
    {
      name: 'Apple Podcasts',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 2.5c5.247 0 9.5 4.253 9.5 9.5s-4.253 9.5-9.5 9.5S2.5 17.247 2.5 12 6.753 2.5 12 2.5zM8.5 12c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5c0 1.381 1.119 2.5 2.5 2.5s2.5-1.119 2.5-2.5c0-2.481-2.019-4.5-4.5-4.5S7.5 9.519 7.5 12c0 2.481 2.019 4.5 4.5 4.5.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5c-4.136 0-7.5-3.364-7.5-7.5z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.017 0C8.396 0 7.989.013 7.041.072 6.096.13 5.432.333 4.865.63c-.653.36-1.308.895-1.828 1.414-.52.52-.955 1.175-1.315 1.828-.297.567-.5 1.231-.559 2.176C1.104 7.996 1.091 8.403 1.091 12.017s.013 4.021.072 4.969c.059.945.262 1.609.559 2.176.36.653.795 1.308 1.315 1.828.52.52 1.175.955 1.828 1.315.567.297 1.231.5 2.176.559.948.059 1.355.072 4.969.072s4.021-.013 4.969-.072c.945-.059 1.609-.262 2.176-.559.653-.36 1.308-.795 1.828-1.315.52-.52.955-1.175 1.315-1.828.297-.567.5-1.231.559-2.176.059-.948.072-1.355.072-4.969s-.013-4.021-.072-4.969c-.059-.945-.262-1.609-.559-2.176-.36-.653-.795-1.308-1.315-1.828-.52-.52-1.175-.955-1.828-1.315-.567-.297-1.231-.5-2.176-.559C16.038.013 15.631 0 12.017 0zM12.017 2.16c3.549 0 3.97.013 5.378.072.798.036 1.232.166 1.52.276.382.148.655.326.942.613.287.287.465.56.613.942.11.288.24.722.276 1.52.059 1.408.072 1.829.072 5.378s-.013 3.97-.072 5.378c-.036.798-.166 1.232-.276 1.52a2.54 2.54 0 0 1-.613.942 2.54 2.54 0 0 1-.942.613c-.288.11-.722.24-1.52.276-1.408.059-1.829.072-5.378.072s-3.97-.013-5.378-.072c-.798-.036-1.232-.166-1.52-.276a2.54 2.54 0 0 1-.942-.613 2.54 2.54 0 0 1-.613-.942c-.11-.288-.24-.722-.276-1.52-.059-1.408-.072-1.829-.072-5.378s.013-3.97.072-5.378c.036-.798.166-1.232.276-1.52.148-.382.326-.655.613-.942.287-.287.56-.465.942-.613.288-.11.722-.24 1.52-.276 1.408-.059 1.829-.072 5.378-.072z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M12.017 15.785a3.768 3.768 0 1 1 0-7.536 3.768 3.768 0 0 1 0 7.536zM12.017 5.839a6.178 6.178 0 1 0 0 12.356 6.178 6.178 0 0 0 0-12.356zM19.604 5.593a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-red-500/20">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6">
              <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-red-400 transition-colors">
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex justify-center space-x-10">
          {navigation.social.map((item) => (
            <a key={item.name} href={item.href} className="text-gray-400 hover:text-red-400 transition-colors">
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="text-xs leading-5 text-gray-400">
            &copy; 2025 Bourbon Budz. All rights reserved.
          </p>
          <p className="text-xs leading-5 text-gray-500 mt-2">
            Drink responsibly. Must be 21+ to enjoy bourbon.
          </p>
          <div className="mt-4 flex justify-center space-x-4 text-xs">
            <Link href="/terms" className="text-gray-500 hover:text-red-400 transition-colors">
              Terms of Service
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/privacy" className="text-gray-500 hover:text-red-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
