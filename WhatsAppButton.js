'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <p className="text-6xl mb-4">🛍️</p>
        <h1 className="font-display text-2xl text-plum dark:text-ivory mb-3">سلتكِ فارغة</h1>
        <p className="text-gray-500 mb-6">ابدئي بإضافة منتجاتكِ المفضلة.</p>
        <Link href="/products" className="bg-plum text-ivory px-8 py-3 rounded-full font-bold">تسوّقي الآن</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl text-plum dark:text-ivory mb-8">سلة المشتريات</h1>
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-white/5 rounded-2xl p-4">
            <div className="w-16 h-16 rounded-xl bg-rosePale dark:bg-white/10 flex items-center justify-center text-2xl shrink-0">🧴</div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm dark:text-ivory">{item.name}</h3>
              <span className="text-gray-500 text-sm">${item.price}</span>
            </div>
            <div className="flex items-center border rounded-full dark:border-white/20">
              <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 dark:text-ivory">-</button>
              <span className="w-8 text-center text-sm dark:text-ivory">{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 dark:text-ivory">+</button>
            </div>
            <span className="font-bold text-plum dark:text-rosePale w-16 text-left">${(item.price * item.qty).toFixed(2)}</span>
            <button onClick={() => removeItem(item.id)} className="text-red-400 text-sm">إزالة</button>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-white/5 rounded-2xl p-6 flex items-center justify-between">
        <span className="text-lg font-bold dark:text-ivory">الإجمالي: ${subtotal.toFixed(2)}</span>
        <Link href="/checkout" className="bg-plum text-ivory px-8 py-3 rounded-full font-bold">إتمام الطلب</Link>
      </div>
    </div>
  );
}
