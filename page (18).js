'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const STATUS_COLOR = {
  'جديد': 'bg-blue-100 text-blue-700',
  'قيد التجهيز': 'bg-yellow-100 text-yellow-700',
  'تم الشحن': 'bg-purple-100 text-purple-700',
  'تم التسليم': 'bg-green-100 text-green-700',
  'ملغي': 'bg-red-100 text-red-700',
};

export default function AccountPage() {
  const { user, profile, loading, signOut } = useAuth();
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();
  const params = useSearchParams();
  const justOrderedId = params.get('order');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setOrders(data || []));
    supabase
      .from('favorites')
      .select('*, products(name, slug, price)')
      .eq('customer_id', user.id)
      .then(({ data }) => setFavorites(data || []));
  }, [user]);

  if (loading || !user) return <p className="text-center py-24 text-gray-400">جارٍ التحميل...</p>;

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-plum dark:text-ivory">حسابي</h1>
        <button onClick={() => { signOut(); router.push('/'); }} className="text-red-500 text-sm font-bold">تسجيل الخروج</button>
      </div>

      <p className="mb-8 dark:text-ivory/80">مرحبًا {profile?.full_name || user.email} 👋</p>

      {justOrderedId && (
        <div className="bg-sage/20 text-sage border border-sage rounded-xl p-4 mb-8 text-sm font-semibold">
          تم استلام طلبكِ بنجاح! سيتم التواصل معكِ قريبًا لتأكيد التوصيل.
        </div>
      )}

      <h2 className="font-bold text-lg mb-4 dark:text-ivory">طلباتي السابقة</h2>
      <div className="space-y-4 mb-12">
        {orders.length === 0 && <p className="text-sm text-gray-400">لا توجد طلبات بعد.</p>}
        {orders.map((o) => (
          <div key={o.id} className="bg-white dark:bg-white/5 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString('ar-EG')}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLOR[o.status] || 'bg-gray-100 text-gray-600'}`}>{o.status}</span>
            </div>
            <ul className="text-sm dark:text-ivory/80 mb-2">
              {o.order_items.map((it) => (
                <li key={it.id}>{it.product_name} × {it.quantity}</li>
              ))}
            </ul>
            <p className="font-bold text-plum dark:text-rosePale">الإجمالي: ${o.total}</p>
          </div>
        ))}
      </div>

      <h2 className="font-bold text-lg mb-4 dark:text-ivory">منتجاتي المفضلة</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {favorites.length === 0 && <p className="text-sm text-gray-400">لا توجد منتجات مفضلة بعد.</p>}
        {favorites.map((f) => (
          <Link key={f.id} href={`/products/${f.products.slug}`} className="bg-white dark:bg-white/5 rounded-xl p-4 text-sm dark:text-ivory">
            {f.products.name} — ${f.products.price}
          </Link>
        ))}
      </div>
    </div>
  );
}
