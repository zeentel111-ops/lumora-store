import Link from 'next/link';
import { getProducts, getCategories, getActiveAnnouncement } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60; // إعادة توليد الصفحة كل دقيقة حتى تنعكس تعديلات لوحة التحكم بسرعة

export default async function HomePage() {
  const [latest, bestSellers, categories, announcement] = await Promise.all([
    getProducts({ featured: true, limit: 8 }).catch(() => []),
    getProducts({ bestSeller: true, limit: 8 }).catch(() => []),
    getCategories().catch(() => []),
    getActiveAnnouncement().catch(() => null),
  ]);

  return (
    <div>
      {announcement && (
        <div className="bg-rose text-white text-sm font-semibold text-center py-2 px-4 animate-pulse">
          {announcement.message}
        </div>
      )}

      {/* البانر المتحرك */}
      <section className="relative overflow-hidden bg-gradient-to-l from-rosePale via-ivory to-sageLight dark:from-plum dark:via-charcoal dark:to-plumLight py-20 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-[fadeIn_1s_ease]">
            <p className="text-rose font-bold mb-3">مستحضرات طبيعية معتمدة</p>
            <h1 className="font-display text-4xl md:text-5xl text-plum dark:text-ivory leading-snug mb-5">
              جمالُكِ الحقيقي <span className="text-rose">يبدأ</span> من هنا
            </h1>
            <p className="text-charcoal/70 dark:text-ivory/70 mb-8 max-w-md">
              تركيبات نباتية خالصة، مصمّمة لتُبرز إشراقتك الطبيعية — تصلكِ من حلب إلى بيتكِ.
            </p>
            <div className="flex gap-4">
              <Link href="/products" className="bg-plum text-ivory px-7 py-3 rounded-full font-bold hover:-translate-y-1 transition shadow-lg">
                تسوّقي الآن
              </Link>
              <Link href="/products?featured=1" className="border-2 border-plum text-plum dark:text-ivory dark:border-ivory px-7 py-3 rounded-full font-bold hover:bg-plum hover:text-ivory transition">
                أحدث المنتجات
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-rose/20 flex items-center justify-center text-8xl animate-bounce [animation-duration:3s]">
              🌸
            </div>
          </div>
        </div>
      </section>

      {/* التصنيفات */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="font-display text-3xl text-plum dark:text-ivory text-center mb-10">تسوّقي حسب الفئة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?cat=${c.slug}`}
              className="bg-white dark:bg-white/5 rounded-2xl p-6 text-center shadow hover:-translate-y-1 transition"
            >
              <h3 className="font-bold dark:text-ivory">{c.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* أحدث المنتجات */}
      <section className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl text-plum dark:text-ivory">أحدث المنتجات</h2>
          <Link href="/products" className="text-rose font-semibold text-sm">عرض الكل ←</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {latest.length === 0 && <p className="col-span-full text-center text-sm text-gray-400">لا توجد منتجات بعد — أضيفي أول منتج من لوحة التحكم.</p>}
          {latest.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* الأكثر مبيعًا */}
      <section className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl text-plum dark:text-ivory">الأكثر مبيعًا</h2>
          <Link href="/products?bestseller=1" className="text-rose font-semibold text-sm">عرض الكل ←</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
