'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

export default function ShoppingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, removeFromCart, updateQuantity, getCheckoutUrl, clearCart } = useCart();

  const handleCheckout = async () => {
    const checkoutUrl = await getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
    }
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-400 hover:text-red-400 transition-colors"
      >
        <ShoppingCartIcon className="h-6 w-6" />
        {state.items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {state.items.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={setIsOpen} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col bg-zinc-900 shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-white">
                            Shopping Cart
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="-m-2 p-2 text-gray-400 hover:text-red-400"
                              onClick={() => setIsOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flow-root">
                            {state.items.length === 0 ? (
                              <div className="text-center py-12">
                                <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-300">Your cart is empty</h3>
                                <p className="mt-1 text-sm text-gray-500">Start adding some merch!</p>
                              </div>
                            ) : (
                              <ul role="list" className="-my-6 divide-y divide-zinc-700">
                                {state.items.map((item) => (
                                  <li key={item.variantId} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-zinc-700">
                                      <div className="h-full w-full bg-gradient-to-br from-red-900/20 to-zinc-800 flex items-center justify-center">
                                        <span className="text-2xl">
                                          {item.title.toLowerCase().includes('glass') || item.title.toLowerCase().includes('mug') ? '🥃' : '👕'}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-white">
                                          <h3>{item.title}</h3>
                                          <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-400">${item.price.toFixed(2)} each</p>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                          <label htmlFor={`quantity-${item.variantId}`} className="text-gray-400">
                                            Qty:
                                          </label>
                                          <select
                                            id={`quantity-${item.variantId}`}
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.variantId, parseInt(e.target.value))}
                                            className="bg-zinc-800 border border-zinc-700 rounded text-white text-sm px-2 py-1"
                                          >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                              <option key={num} value={num}>{num}</option>
                                            ))}
                                          </select>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => removeFromCart(item.variantId)}
                                          className="font-medium text-red-400 hover:text-red-300 flex items-center"
                                        >
                                          <TrashIcon className="h-4 w-4 mr-1" />
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>

                      {state.items.length > 0 && (
                        <div className="border-t border-zinc-700 px-4 py-6 sm:px-6">
                          <div className="flex justify-between text-base font-medium text-white">
                            <p>Subtotal</p>
                            <p>${state.total.toFixed(2)}</p>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-400">Shipping and taxes calculated at checkout.</p>
                          <div className="mt-6 space-y-4">
                            <button
                              onClick={handleCheckout}
                              disabled={state.isLoading}
                              className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {state.isLoading ? 'Processing...' : 'Checkout'}
                            </button>
                            <button
                              onClick={clearCart}
                              className="flex w-full items-center justify-center rounded-md border border-zinc-600 px-6 py-3 text-base font-medium text-gray-300 hover:bg-zinc-800"
                            >
                              Clear Cart
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
