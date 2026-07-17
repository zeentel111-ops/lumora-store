export default function robots() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://lumora-syria.com';
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/account', '/checkout'] },
    ],
    sitemap: `${site}/sitemap.xml`,
  };
}
