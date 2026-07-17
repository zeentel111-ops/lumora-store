import { getProductBySlug, getRelatedProducts, getApprovedReviews } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/ProductGallery';
import AddToCartBox from '@/components/AddToCartBox';
import ReviewsSection from '@/components/ReviewsSection';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description?.slice(0, 155),
    openGraph: { images: product.image ? [product.image] : [] },
  };
}

export const revalidate = 60;

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product.category_id, product.id).catch(() => []),
    getApprovedReviews(product.id).catch(() => []),
  ]);

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="text-rose font-bold text-sm mb-2">{product.category_name}</p>
          <h1 className="font-display text-3xl text-plum dark:text-ivory mb-3">{product.name}</h1>

          {avgRating && (
            <div className="flex items-center gap-2 mb-4 text-sm">
              <span className="text-gold">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</span>
              <span className="text-gray-500">({avgRating} من {reviews.length} تقييم)</span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <span className="font-display text-3xl text-plum dark:text-rosePale">${product.price}</span>
            {product.compare_at_price > product.price && (
              <span className="text-gray-400 line-through">${product.compare_at_price}</span>
            )}
          </div>

          <p className="text-charcoal/80 dark:text-ivory/80 mb-6 leading-8">{product.description}</p>

          <dl className="grid grid-cols-2 gap-4 mb-6 text-sm">
            {product.size && (
              <div><dt className="font-bold dark:text-ivory">الحجم</dt><dd className="text-gray-500">{product.size}</dd></div>
            )}
            {product.skin_type && (
              <div><dt className="font-bold dark:text-ivory">مناسب لبشرة</dt><dd className="text-gray-500">{product.skin_type}</dd></div>
            )}
            <div>
              <dt className="font-bold dark:text-ivory">التوفر</dt>
              <dd className={product.stock > 0 ? 'text-sage font-semibold' : 'text-red-500 font-semibold'}>
                {product.stock > 0 ? `متوفر (${product.stock} قطعة)` : 'نفدت الكمية'}
              </dd>
            </div>
          </dl>

          <AddToCartBox product={product} />

          {product.usage_instructions && (
            <div className="mt-8 border-t pt-6 dark:border-white/10">
              <h3 className="font-bold mb-2 dark:text-ivory">طريقة الاستخدام</h3>
              <p className="text-sm text-gray-500 leading-7">{product.usage_instructions}</p>
            </div>
          )}
          {product.ingredients && (
            <div className="mt-6">
              <h3 className="font-bold mb-2 dark:text-ivory">المكونات</h3>
              <p className="text-sm text-gray-500 leading-7">{product.ingredients}</p>
            </div>
          )}
        </div>
      </div>

      <ReviewsSection productId={product.id} reviews={reviews} />

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl text-plum dark:text-ivory mb-6">منتجات مشابهة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
