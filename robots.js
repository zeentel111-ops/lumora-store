'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleActive(p) {
    await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id);
    load();
  }

  async function remove(id) {
    if (!confirm('هل أنتِ متأكدة من حذف هذا المنتج؟')) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-plum dark:text-ivory">المنتجات</h1>
        <Link href="/admin/products/new" className="bg-plum text-ivory px-5 py-2.5 rounded-full font-bold text-sm">+ إضافة منتج</Link>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-rosePale dark:bg-white/10 text-right">
            <tr>
              <th className="p-4">المنتج</th>
              <th className="p-4">التصنيف</th>
              <th className="p-4">السعر</th>
              <th className="p-4">المخزون</th>
              <th className="p-4">الحالة</th>
              <th className="p-4">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="p-6 text-center text-gray-400">جارٍ التحميل...</td></tr>}
            {!loading && products.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-gray-400">لا توجد منتجات بعد.</td></tr>}
            {products.map((p) => (
              <tr key={p.id} className="border-t dark:border-white/10">
                <td className="p-4 font-semibold dark:text-ivory">{p.name}</td>
                <td className="p-4 text-gray-500">{p.categories?.name || '—'}</td>
                <td className="p-4 dark:text-ivory">${p.price}</td>
                <td className="p-4">
                  <span className={p.stock <= 0 ? 'text-red-500 font-bold' : 'dark:text-ivory'}>{p.stock}</span>
                </td>
                <td className="p-4">
                  <button onClick={() => toggleActive(p)} className={`text-xs font-bold px-3 py-1 rounded-full ${p.is_active ? 'bg-sage/20 text-sage' : 'bg-gray-200 text-gray-500'}`}>
                    {p.is_active ? 'ظاهر' : 'مخفي'}
                  </button>
                </td>
                <td className="p-4 flex gap-3">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-plum dark:text-rosePale font-bold">تعديل</Link>
                  <button onClick={() => remove(p.id)} className="text-red-500 font-bold">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
