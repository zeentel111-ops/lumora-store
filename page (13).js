import { getProducts } from '@/lib/db';

export default async function sitemap() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://lumora-syria.com';
  const staticPages = ['', '/products', '/about', '/contact', '/faq', '/privacy'].map((p) => ({
    url: `${site}${p}`,
    lastModified: new Date(),
  }));

  let productPages = [];
  try {
    const products = await getProducts();
    productPages = products.map((p) => ({
      url: `${site}/products/${p.slug}`,
      lastModified: p.updated_at || new Date(),
    }));
  } catch (e) {}

  return [...staticPages, ...productPages];
}
