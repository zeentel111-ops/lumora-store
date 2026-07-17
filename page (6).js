'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminOrderNotifier from '@/components/AdminOrderNotifier';

const LINKS = [
  { href: '/admin', label: '📊 نظرة عامة' },
  { href: '/admin/products', label: '🧴 المنتجات' },
  { href: '/admin/categories', label: '🗂️ التصنيفات' },
  { href: '/admin/orders', label: '📦 الطلبات' },
  { href: '/admin/coupons', label: '🏷️ الكوبونات والعروض' },
];

export default function AdminLayout({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/login');
  }, [loading, user, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return <p className="text-center py-24 text-gray-400">جارٍ التحقق من الصلاحيات...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-8 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-2">
        <h2 className="font-display text-xl text-plum dark:text-ivory mb-4">لوحة تحكم Lumora</h2>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`block px-4 py-2.5 rounded-xl text-sm font-semibold ${
              pathname === l.href ? 'bg-plum text-ivory' : 'bg-white dark:bg-white/5 dark:text-ivory'
            }`}
          >
            {l.label}
          </Link>
        ))}
        <AdminOrderNotifier />
      </aside>
      <div>{children}</div>
    </div>
  );
}
