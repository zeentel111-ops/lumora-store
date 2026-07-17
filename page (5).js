'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  async function load() {
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCategories(data || []);
  }

  useEffect(() => { load(); }, []);

  async function addCategory(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const slug = name.trim().replace(/\s+/g, '-');
    await supabase.from('categories').insert({ name, slug, sort_order: categories.length });
    setName('');
    load();
  }

  async function remove(id) {
    if (!confirm('حذف هذا التصنيف؟ المنتجات المرتبطة به لن تُحذف لكنها ستفقد تصنيفها.')) return;
    await supabase.from('categories').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-plum dark:text-ivory mb-8">التصنيفات</h1>

      <form onSubmit={addCategory} className="flex gap-3 mb-8 max-w-md">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم التصنيف الجديد" className="flex-1 rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        <button className="bg-plum text-ivory px-6 rounded-xl font-bold">إضافة</button>
      </form>

      <div className="space-y-3 max-w-md">
        {categories.map((c) => (
          <div key={c.id} className="bg-white dark:bg-white/5 rounded-xl p-4 flex items-center justify-between">
            <span className="font-semibold dark:text-ivory">{c.name}</span>
            <button onClick={() => remove(c.id)} className="text-red-500 text-sm font-bold">حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
}
