'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      const [{ count: products }, { count: orders }, { count: newOrders }, { count: customers }, { data: revenueData }] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'جديد'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total').neq('status', 'ملغي'),
      ]);
      const revenue = (revenueData || []).reduce((s, o) => s + Number(o.total), 0);
      setStats({ products, orders, newOrders, customers, revenue });
    }
    load();
  }, []);

  const cards = stats
    ? [
        { label: 'إجمالي المنتجات', value: stats.products, icon: '🧴' },
        { label: 'إجمالي الطلبات', value: stats.orders, icon: '📦' },
        { label: 'طلبات جديدة', value: stats.newOrders, icon: '🔔' },
        { label: 'العملاء المسجلين', value: stats.customers, icon: '👥' },
        { label: 'إجمالي المبيعات', value: `$${stats.revenue.toFixed(2)}`, icon: '💰' },
      ]
    : [];

  return (
    <div>
      <h1 className="font-display text-3xl text-plum dark:text-ivory mb-8">نظرة عامة</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {!stats && <p className="text-gray-400">جارٍ التحميل...</p>}
        {cards.map((c) => (
          <div key={c.label} className="bg-white dark:bg-white/5 rounded-2xl p-6">
            <div className="text-3xl mb-2">{c.icon}</div>
            <div className="text-2xl font-bold text-plum dark:text-ivory">{c.value}</div>
            <div className="text-sm text-gray-500">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
