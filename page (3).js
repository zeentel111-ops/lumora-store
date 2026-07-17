'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const STATUSES = ['جديد', 'قيد التجهيز', 'تم الشحن', 'تم التسليم', 'ملغي'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('الكل');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    await supabase.from('orders').update({ status }).eq('id', id);
    load();
  }

  const visible = filter === 'الكل' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <h1 className="font-display text-3xl text-plum dark:text-ivory mb-6">الطلبات</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['الكل', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold ${filter === s ? 'bg-plum text-ivory' : 'bg-white dark:bg-white/5 dark:text-ivory'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading && <p className="text-gray-400">جارٍ التحميل...</p>}
        {!loading && visible.length === 0 && <p className="text-gray-400">لا توجد طلبات.</p>}
        {visible.map((o) => (
          <div key={o.id} className="bg-white dark:bg-white/5 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <p className="font-bold dark:text-ivory">{o.customer_name} — {o.phone}</p>
                <p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString('ar-EG')}</p>
              </div>
              <select
                value={o.status}
                onChange={(e) => updateStatus(o.id, e.target.value)}
                className="rounded-full px-4 py-1.5 text-sm font-bold border dark:bg-white/10 dark:text-ivory"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <p className="text-sm text-gray-500 mb-2">📍 {o.address}</p>
            {o.notes && <p className="text-sm text-gray-500 mb-2">📝 {o.notes}</p>}
            <ul className="text-sm dark:text-ivory/80 mb-2">
              {o.order_items.map((it) => <li key={it.id}>{it.product_name} × {it.quantity} — ${it.price}</li>)}
            </ul>
            <p className="font-bold text-plum dark:text-rosePale">الإجمالي: ${o.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
