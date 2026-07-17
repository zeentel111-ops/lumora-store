'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: '', discount_percent: '', expires_at: '' });

  async function load() {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    setCoupons(data || []);
  }
  useEffect(() => { load(); }, []);

  async function addCoupon(e) {
    e.preventDefault();
    if (!form.code) return;
    await supabase.from('coupons').insert({
      code: form.code.toUpperCase(),
      discount_percent: Number(form.discount_percent) || null,
      expires_at: form.expires_at || null,
      is_active: true,
    });
    setForm({ code: '', discount_percent: '', expires_at: '' });
    load();
  }

  async function toggleActive(c) {
    await supabase.from('coupons').update({ is_active: !c.is_active }).eq('id', c.id);
    load();
  }

  async function remove(id) {
    if (!confirm('حذف هذا الكوبون؟')) return;
    await supabase.from('coupons').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-plum dark:text-ivory mb-8">الكوبونات والعروض</h1>

      <form onSubmit={addCoupon} className="flex flex-wrap gap-3 mb-8">
        <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="كود الكوبون" className="rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        <input required type="number" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} placeholder="نسبة الخصم %" className="rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory w-40" />
        <input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} className="rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        <button className="bg-plum text-ivory px-6 rounded-xl font-bold">إضافة</button>
      </form>

      <div className="space-y-3 max-w-lg">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white dark:bg-white/5 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="font-bold dark:text-ivory">{c.code}</span>
              <span className="text-sm text-gray-500 mr-2">— خصم {c.discount_percent}%</span>
              {c.expires_at && <span className="text-xs text-gray-400 block">ينتهي: {c.expires_at}</span>}
            </div>
            <div className="flex gap-3 items-center">
              <button onClick={() => toggleActive(c)} className={`text-xs font-bold px-3 py-1 rounded-full ${c.is_active ? 'bg-sage/20 text-sage' : 'bg-gray-200 text-gray-500'}`}>
                {c.is_active ? 'فعّال' : 'موقوف'}
              </button>
              <button onClick={() => remove(c.id)} className="text-red-500 text-sm font-bold">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
