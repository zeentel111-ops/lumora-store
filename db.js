import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export const metadata = { title: 'المنتجات' };
export const revalidate = 60;

export default async function ProductsPage({ searchParams }) {
  const { cat, skin, min, max, q, featured, bestseller } = searchParams || {};

  const [products, categories] = await Promise.all([
    getProducts({
      category: cat,
      skinType: skin,
      minPrice: min,
      maxPrice: max,
      q,
      featured: featured === '1',
      bestSeller: bestseller === '1',
    }).catch(() => []),
    getCategories().catch(() => []),
  ]);

  const skinTypes = ['جافة', 'دهنية', 'عادية', 'مختلطة', 'حساسة'];

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-[220px_1fr] gap-8">
      {/* الفلاتر */}
      <aside className="space-y-8">
        <div>
          <h3 className="font-bold mb-3 dark:text-ivory">التصنيفات</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className={!cat ? 'text-rose font-bold' : 'dark:text-ivory/80'}>الكل</Link></li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/products?cat=${c.slug}`} className={cat === c.slug ? 'text-rose font-bold' : 'dark:text-ivory/80'}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3 dark:text-ivory">نوع البشرة</h3>
          <ul className="space-y-2 text-sm">
            {skinTypes.map((s) => (
              <li key={s}>
                <Link href={`/products?skin=${encodeURIComponent(s)}`} className={skin === s ? 'text-rose font-bold' : 'dark:text-ivory/80'}>
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <form className="space-y-3" action="/products" method="get">
          <h3 className="font-bold dark:text-ivory">نطاق السعر ($)</h3>
          <div className="flex gap-2">
            <input name="min" type="number" placeholder="من" defaultValue={min} className="w-full rounded-lg px-2 py-1.5 text-sm border dark:bg-white/10 dark:text-ivory" />
            <input name="max" type="number" placeholder="إلى" defaultValue={max} className="w-full rounded-lg px-2 py-1.5 text-sm border dark:bg-white/10 dark:text-ivory" />
          </div>
          <button className="w-full bg-plum text-ivory rounded-lg py-2 text-sm font-bold">تطبيق</button>
        </form>
      </aside>

      {/* النتائج */}
      <div>
        {q && <p className="mb-4 text-sm text-gray-500">نتائج البحث عن: «{q}» ({products.length})</p>}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 && <p className="col-span-full text-center text-gray-400 py-16">لا توجد منتجات مطابقة.</p>}
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
