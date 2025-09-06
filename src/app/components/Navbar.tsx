'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Bars3Icon, XMarkIcon, UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ShoppingCart from './ShoppingCart';

interface NavigationItem {
  name: string;
  href: string;
  special?: boolean;
}

const navigation: NavigationItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Episodes', href: '/episodes' },
  { name: 'After Dark', href: '/after-dark', special: true },
  { name: 'Shop', href: '/shop' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const { data: session } = useSession();

  // Check if user is an admin
  const isAdmin = session?.user?.email === 'bourbonbudz@gmail.com' || 
                  session?.user?.email === 'admin@bourbonbudz.com' || 
                  session?.user?.email === 'chet@bourbonbudz.com' ||
                  session?.user?.email === 'john@bourbonbudz.com';

  return (
    <header className="bg-black/90 backdrop-blur-sm border-b border-red-500/20 sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold text-red-400">Bourbon Budz</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-red-400"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-semibold leading-6 transition-colors ${
                item.special
                  ? 'text-red-500 hover:text-red-400 font-bold'
                  : 'text-white hover:text-red-400'
              }`}
            >
              {item.name}
              {item.special && <span className="ml-1">🔥</span>}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-4">
          <ShoppingCart />
          {session ? (
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <div className="relative">
                  <button
                    onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                    className="text-sm font-semibold leading-6 text-yellow-400 hover:text-yellow-300 transition-colors flex items-center"
                  >
                    Admin
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                  </button>
                  
                  {adminDropdownOpen && (
                    <div className="absolute top-full mt-2 right-0 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50">
                      <Link
                        href="/admin/stream"
                        className="block px-4 py-2 text-sm text-white hover:bg-zinc-800 transition-colors"
                        onClick={() => setAdminDropdownOpen(false)}
                      >
                        Stream Management
                      </Link>
                      <Link
                        href="/admin/rtmp"
                        className="block px-4 py-2 text-sm text-white hover:bg-zinc-800 transition-colors"
                        onClick={() => setAdminDropdownOpen(false)}
                      >
                        RTMP Streaming
                      </Link>
                      <Link
                        href="/admin/users"
                        className="block px-4 py-2 text-sm text-white hover:bg-zinc-800 transition-colors"
                        onClick={() => setAdminDropdownOpen(false)}
                      >
                        User Management
                      </Link>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center space-x-2">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                )}
                <span className="text-white text-sm">{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="text-sm font-semibold leading-6 text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-red-500/20">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="text-xl font-bold text-red-400">Bourbon Budz</span>
              </Link>
              <div className="flex items-center space-x-2">
                <ShoppingCart />
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-red-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-red-500/20">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors ${
                        item.special
                          ? 'text-red-500 hover:bg-red-500/10 font-bold'
                          : 'text-white hover:bg-red-500/10'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                      {item.special && <span className="ml-1">🔥</span>}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  {session ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 px-3">
                        {session.user?.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || 'User'}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <span className="text-white font-medium">{session.user?.name}</span>
                      </div>
                      {isAdmin && (
                        <>
                          <Link
                            href="/admin/stream"
                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-yellow-400 hover:bg-yellow-400/10"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            ⚙️ Stream Admin
                          </Link>
                          <Link
                            href="/admin/rtmp"
                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-yellow-400 hover:bg-yellow-400/10"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            📡 RTMP Streaming
                          </Link>
                          <Link
                            href="/admin/users"
                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-yellow-400 hover:bg-yellow-400/10"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            👥 User Management
                          </Link>
                        </>
                      )}
                      <button
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-300 hover:bg-red-500/10"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/auth/signin"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-red-500 hover:bg-red-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Click outside to close admin dropdown */}
      {adminDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setAdminDropdownOpen(false)}
        />
      )}
    </header>
  );
}
