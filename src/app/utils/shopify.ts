// Shopify Storefront API client
import Client from 'shopify-buy';

// Initialize the client
const client = Client.buildClient({
  domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'your-shop-name.myshopify.com',
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'your-storefront-access-token',
  apiVersion: '2023-10'
});

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  images: Array<{
    src: string;
    altText?: string;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: string;
    available: boolean;
  }>;
  handle: string;
  productType: string;
  tags: string[];
  vendor: string;
  availableForSale: boolean;
}

export interface ShopifyCart {
  id: string;
  webUrl: string;
  lineItems: Array<{
    id: string;
    title: string;
    variant: {
      id: string;
      title: string;
      price: string;
      image?: {
        src: string;
      };
    };
    quantity: number;
  }>;
  lineItemsSubtotalPrice: {
    amount: string;
    currencyCode: string;
  };
}

// Fetch all products
export async function fetchShopifyProducts(): Promise<ShopifyProduct[]> {
  try {
    const products = await client.product.fetchAll();
    return products.map(product => ({
      id: product.id.toString(),
      title: product.title,
      description: product.description,
      images: product.images.map(img => ({
        src: img.src,
        altText: img.altText
      })),
      variants: product.variants.map(variant => ({
        id: variant.id.toString(),
        title: variant.title,
        price: variant.price.amount.toString(),
        available: variant.availableForSale
      })),
      handle: product.handle,
      productType: product.productType,
      tags: product.tags,
      vendor: product.vendor,
      availableForSale: product.availableForSale
    }));
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return [];
  }
}

// Fetch products by collection
export async function fetchProductsByCollection(collectionHandle: string): Promise<ShopifyProduct[]> {
  try {
    const collection = await client.collection.fetchWithProducts(collectionHandle, { productsFirst: 50 });
    return collection.products.map(product => ({
      id: product.id.toString(),
      title: product.title,
      description: product.description,
      images: product.images.map(img => ({
        src: img.src,
        altText: img.altText
      })),
      variants: product.variants.map(variant => ({
        id: variant.id.toString(),
        title: variant.title,
        price: variant.price.amount.toString(),
        available: variant.availableForSale
      })),
      handle: product.handle,
      productType: product.productType,
      tags: product.tags,
      vendor: product.vendor,
      availableForSale: product.availableForSale
    }));
  } catch (error) {
    console.error('Error fetching collection products:', error);
    return [];
  }
}

// Create checkout
export async function createCheckout(): Promise<any> {
  try {
    const checkout = await client.checkout.create();
    return checkout;
  } catch (error) {
    console.error('Error creating checkout:', error);
    return null;
  }
}

// Add to cart (checkout)
export async function addToCheckout(checkoutId: string, lineItemsToAdd: Array<{
  variantId: string;
  quantity: number;
}>): Promise<any> {
  try {
    const checkout = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
    return checkout;
  } catch (error) {
    console.error('Error adding to checkout:', error);
    return null;
  }
}

// Get checkout URL for redirect to Shopify
export function getCheckoutUrl(checkout: any): string {
  return checkout.webUrl;
}

// Shopify Buy Button (alternative to full cart)
export function generateBuyButtonUrl(variantId: string): string {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'your-shop-name.myshopify.com';
  return `https://${domain}/cart/${variantId}:1`;
}

export { client };
