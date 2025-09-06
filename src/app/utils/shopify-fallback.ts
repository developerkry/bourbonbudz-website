// Shop categories for Bourbon Budz merchandise
export const shopCategories = [
  {
    name: 'Apparel',
    items: ['T-Shirts', 'Hats']
  },
  {
    name: 'Drinkware', 
    items: ['Flasks', 'Glencairn Glasses', 'Rocks Glasses']
  },
  {
    name: 'Accessories',
    items: ['Coasters']
  },
  {
    name: 'Cigar',
    items: ['Cigar Cutters', 'Cigar Ashtrays', 'Cigar Sets']
  }
];

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
  collections: string[]; // Added collections array
}

// Check if Shopify is configured
function isShopifyConfigured(): boolean {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  console.log('Checking Shopify config:', { 
    domain: domain ? 'Set' : 'Not set', 
    token: token ? 'Set' : 'Not set',
    domainValue: domain,
    tokenLength: token ? token.length : 0
  });
  
  return !!(domain && token && 
    domain !== 'your-shop-name.myshopify.com' && 
    token !== 'your-storefront-access-token-here');
}

// Mock products for demonstration when Shopify is not configured
const mockProducts: ShopifyProduct[] = [
  {
    id: 'mock-1',
    title: 'Bourbon Budz T-Shirt',
    description: 'Classic Bourbon Budz podcast t-shirt in black with red logo',
    images: [{ src: '/api/placeholder/400/400', altText: 'Bourbon Budz T-Shirt' }],
    variants: [
      { id: 'mock-1-s', title: 'Small', price: '24.99', available: true },
      { id: 'mock-1-m', title: 'Medium', price: '24.99', available: true },
      { id: 'mock-1-l', title: 'Large', price: '24.99', available: false }
    ],
    handle: 'bourbon-budz-tshirt',
    productType: 'T-Shirt',
    tags: ['tshirt', 'apparel'],
    vendor: 'Bourbon Budz',
    availableForSale: true,
    collections: ['apparel']
  },
  {
    id: 'mock-2',
    title: 'THEM GUYS Baseball Cap',
    description: 'Show your support for THEM GUYS with this classic baseball cap',
    images: [{ src: '/api/placeholder/400/400', altText: 'THEM GUYS Baseball Cap' }],
    variants: [
      { id: 'mock-2-os', title: 'One Size', price: '19.99', available: true }
    ],
    handle: 'them-guys-cap',
    productType: 'Hat',
    tags: ['hat', 'cap', 'apparel'],
    vendor: 'Bourbon Budz',
    availableForSale: true,
    collections: ['apparel']
  },
  {
    id: 'mock-3',
    title: 'Bourbon Tasting Flask',
    description: 'Premium stainless steel flask perfect for bourbon tastings',
    images: [{ src: '/api/placeholder/400/400', altText: 'Bourbon Tasting Flask' }],
    variants: [
      { id: 'mock-3-6oz', title: '6oz', price: '34.99', available: true }
    ],
    handle: 'bourbon-flask',
    productType: 'Flask',
    tags: ['flask', 'drinkware', 'featured'],
    vendor: 'Bourbon Budz',
    availableForSale: true,
    collections: ['drinkware', 'featured']
  },
  {
    id: 'mock-4',
    title: 'Glencairn Whiskey Glass Set',
    description: 'Set of 2 professional Glencairn glasses for bourbon tasting',
    images: [{ src: '/api/placeholder/400/400', altText: 'Glencairn Glass Set' }],
    variants: [
      { id: 'mock-4-set', title: 'Set of 2', price: '28.99', available: true }
    ],
    handle: 'glencairn-set',
    productType: 'Glassware',
    tags: ['glass', 'glencairn', 'drinkware', 'featured'],
    vendor: 'Bourbon Budz',
    availableForSale: true,
    collections: ['drinkware', 'featured']
  },
  {
    id: 'mock-5',
    title: 'Bourbon Budz Coaster Set',
    description: 'Set of 4 wooden coasters with Bourbon Budz logo',
    images: [{ src: '/api/placeholder/400/400', altText: 'Coaster Set' }],
    variants: [
      { id: 'mock-5-set', title: 'Set of 4', price: '16.99', available: true }
    ],
    handle: 'coaster-set',
    productType: 'Coaster',
    tags: ['coaster', 'accessories'],
    vendor: 'Bourbon Budz',
    availableForSale: true,
    collections: ['accessories']
  },
  {
    id: 'mock-6',
    title: 'Premium Cigar Cutter',
    description: 'High-quality stainless steel cigar cutter with Bourbon Budz engraving',
    images: [{ src: '/api/placeholder/400/400', altText: 'Cigar Cutter' }],
    variants: [
      { id: 'mock-6-standard', title: 'Standard', price: '45.99', available: true }
    ],
    handle: 'cigar-cutter',
    productType: 'Cigar Accessory',
    tags: ['cigar', 'cutter'],
    vendor: 'Bourbon Budz',
    availableForSale: true,
    collections: ['cigar']
  }
];

// Fetch all products
export async function fetchShopifyProducts(): Promise<ShopifyProduct[]> {
  try {
    // Check if Shopify is configured
    if (!isShopifyConfigured()) {
      console.log('Shopify not configured. Using mock products for demonstration.');
      return mockProducts;
    }

    // Fetch real products from Shopify
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    
    const query = `
      query getProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              title
              description
              handle
              productType
              tags
              vendor
              availableForSale
              images(first: 5) {
                edges {
                  node {
                    src
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                    }
                    availableForSale
                  }
                }
              }
              collections(first: 10) {
                edges {
                  node {
                    handle
                    title
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(`https://${domain}/api/2023-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token || '',
      },
      body: JSON.stringify({
        query,
        variables: { first: 50 }
      })
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`Shopify GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    // Transform Shopify data to our format
    const products: ShopifyProduct[] = data.data.products.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      description: edge.node.description,
      images: edge.node.images.edges.map((imgEdge: any) => ({
        src: imgEdge.node.src,
        altText: imgEdge.node.altText || edge.node.title
      })),
      variants: edge.node.variants.edges.map((varEdge: any) => ({
        id: varEdge.node.id,
        title: varEdge.node.title,
        price: parseFloat(varEdge.node.price.amount).toFixed(2),
        available: varEdge.node.availableForSale
      })),
      handle: edge.node.handle,
      productType: edge.node.productType,
      tags: edge.node.tags,
      vendor: edge.node.vendor,
      availableForSale: edge.node.availableForSale,
      collections: edge.node.collections.edges.map((colEdge: any) => colEdge.node.handle)
    }));

    console.log(`Successfully loaded ${products.length} products from Shopify`);
    return products;

  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return []; // Return empty array on error
  }
}

// Fetch products by collection
export async function fetchProductsByCollection(collectionHandle: string): Promise<ShopifyProduct[]> {
  try {
    const allProducts = await fetchShopifyProducts();
    return allProducts.filter(product => 
      product.productType.toLowerCase() === collectionHandle.toLowerCase()
    );
  } catch (error) {
    console.error('Error fetching collection products:', error);
    return [];
  }
}

// Create checkout - simplified for mock implementation
export async function createCheckout(): Promise<any> {
  return {
    id: 'mock-checkout-' + Date.now(),
    webUrl: 'https://checkout.shopify.com/mock-checkout',
    lineItems: []
  };
}

// Add to cart (checkout) - simplified for mock implementation
export async function addToCheckout(checkoutId: string, lineItemsToAdd: Array<{
  variantId: string;
  quantity: number;
}>): Promise<any> {
  return {
    id: checkoutId,
    webUrl: 'https://checkout.shopify.com/mock-checkout-with-items',
    lineItems: lineItemsToAdd
  };
}

// Get checkout URL for redirect to Shopify
export function getCheckoutUrl(checkout: any): string {
  return checkout.webUrl;
}

// Simplified buy button URL
export function generateBuyButtonUrl(variantId: string): string {
  if (isShopifyConfigured()) {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    return `https://${domain}/cart/${variantId}:1`;
  }
  return '#'; // Placeholder for mock
}
