'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ProductForm({ initial, productId }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(
    initial || {
      name: '', slug: '', category_id: '', description: '', usage_instructions: '',
      ingredients: '', skin_type: '', size: '', price: '', compare_at_price: '',
      stock: 0, is_active: true, is_featured: false, is_best_seller: false,
    }
  );
  const [images, setImages] = useState(initial?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => setCategories(data || []));
  }, []);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  function slugify(text) {
    return text.trim().replace(/\s+/g, '-');
  }

  async function uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      setImages((imgs) => [...imgs, data.publicUrl]);
    }
    setUploading(false);
  }

  function removeImage(url) {
    setImages((imgs) => imgs.filter((i) => i !== url));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      price: Number(form.price) || 0,
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      stock: Number(form.stock) || 0,
      category_id: form.category_id || null,
    };

    let savedId = productId;
    if (productId) {
      await supabase.from('products').update(payload).eq('id', productId);
    } else {
      const { data } = await supabase.from('products').insert(payload).select().single();
      savedId = data?.id;
    }

    if (savedId) {
      await supabase.from('product_images').delete().eq('product_id', savedId);
      if (images.length) {
        await supabase.from('product_images').insert(
          images.map((url, i) => ({ product_id: savedId, url, sort_order: i }))
        );
      }
    }

    setSaving(false);
    router.push('/admin/products');
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-bold mb-1 dark:text-ivory">اسم المنتج</label>
        <input required name="name" value={form.name} onChange={onChange} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1 dark:text-ivory">التصنيف</label>
        <select name="category_id" value={form.category_id || ''} onChange={onChange} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory">
          <option value="">— اختاري —</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1 dark:text-ivory">صور المنتج</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((url) => (
            <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden bg-rosePale">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(url)} className="absolute top-0.5 left-0.5 bg-black/60 text-white w-5 h-5 rounded-full text-xs">×</button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} className="text-sm dark:text-ivory" />
        {uploading && <p className="text-xs text-gray-400 mt-1">جارٍ رفع الصورة...</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1 dark:text-ivory">السعر ($)</label>
          <input required type="number" step="0.01" name="price" value={form.price} onChange={onChange} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 dark:text-ivory">السعر قبل الخصم (اختياري)</label>
          <input type="number" step="0.01" name="compare_at_price" value={form.compare_at_price || ''} onChange={onChange} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 dark:text-ivory">الكمية بالمخزون</label>
          <input required type="number" name="stock" value={form.stock} onChange={onChange} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 dark:text-ivory">الحجم</label>
          <input name="size" value={form.size || ''} onChange={onChange} placeholder="مثال: 50 مل" className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1 dark:text-ivory">نوع البشرة المناسب</label>
        <input name="skin_type" value={form.skin_type || ''} onChange={onChange} placeholder="مثال: جافة، دهنية، عادية" className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1 dark:text-ivory">الوصف الكامل</label>
        <textarea name="description" value={form.description || ''} onChange={onChange} rows={3} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1 dark:text-ivory">طريقة الاستخدام</label>
        <textarea name="usage_instructions" value={form.usage_instructions || ''} onChange={onChange} rows={2} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1 dark:text-ivory">المكونات</label>
        <textarea name="ingredients" value={form.ingredients || ''} onChange={onChange} rows={2} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
      </div>

      <div className="flex gap-6 text-sm dark:text-ivory">
        <label className="flex items-center gap-2"><input type="checkbox" name="is_active" checked={form.is_active} onChange={onChange} /> ظاهر بالموقع</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="is_featured" checked={form.is_featured} onChange={onChange} /> أحدث المنتجات</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="is_best_seller" checked={form.is_best_seller} onChange={onChange} /> الأكثر مبيعًا</label>
      </div>

      <button disabled={saving} className="bg-plum text-ivory px-8 py-3 rounded-full font-bold disabled:opacity-50">
        {saving ? 'جارٍ الحفظ...' : 'حفظ المنتج'}
      </button>
    </form>
  );
}
