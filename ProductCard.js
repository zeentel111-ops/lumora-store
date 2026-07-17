'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '', coupon: '' });
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = Math.max(subtotal - discount, 0);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function applyCoupon() {
    if (!form.coupon) return;
    const { data } = await supabase.from('coupons').select('*').eq('code', form.coupon).eq('is_active', true).single();
    if (!data) { setError('كود الخصم غير صالح.'); setDiscount(0); return; }
    setError('');
    const d = data.discount_percent ? (subtotal * data.discount_percent) / 100 : data.discount_amount || 0;
    setDiscount(d);
  }

  async function placeOrder(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError('');

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        customer_id: user?.id || null,
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        notes: form.notes,
        payment_method: 'cod',
        coupon_code: form.coupon || null,
        subtotal,
        discount,
        total,
        status: 'جديد',
      })
      .select()
      .single();

    if (orderErr) { setError('صار خطأ أثناء إرسال الطلب، حاولي مرة ثانية.'); setLoading(false); return; }

    const orderItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.id,
      product_name: i.name,
      quantity: i.qty,
      price: i.price,
    }));
    await supabase.from('order_items').insert(orderItems);

    clearCart();
    router.push(`/account?order=${order.id}`);
  }

  if (items.length === 0) {
    return <p className="max-w-md mx-auto px-5 py-24 text-center text-gray-400">سلتكِ فارغة.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl text-plum dark:text-ivory mb-8">إتمام الطلب</h1>
      <form onSubmit={placeOrder} className="space-y-4">
        <input required name="name" value={form.name} onChange={onChange} placeholder="الاسم الكامل" className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        <input required name="phone" value={form.phone} onChange={onChange} placeholder="رقم الهاتف" className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        <input required name="address" value={form.address} onChange={onChange} placeholder="العنوان بالتفصيل (المدينة، الحي، أقرب معلم)" className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        <textarea name="notes" value={form.notes} onChange={onChange} placeholder="ملاحظات إضافية (اختياري)" rows={3} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />

        <div className="flex gap-2">
          <input name="coupon" value={form.coupon} onChange={onChange} placeholder="كود الخصم (إن وجد)" className="flex-1 rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
          <button type="button" onClick={applyCoupon} className="bg-sage text-white px-5 rounded-xl font-bold">تطبيق</button>
        </div>

        <div>
          <h3 className="font-bold mb-2 dark:text-ivory">طريقة الدفع</h3>
          <label className="flex items-center gap-2 bg-white dark:bg-white/5 rounded-xl p-3">
            <input type="radio" checked readOnly /> الدفع عند الاستلام
          </label>
          <label className="flex items-center gap-2 bg-white/50 dark:bg-white/5 rounded-xl p-3 mt-2 opacity-50">
            <input type="radio" disabled /> الدفع الإلكتروني (قريبًا)
          </label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="bg-rosePale dark:bg-white/5 rounded-xl p-5 space-y-1 text-sm">
          <div className="flex justify-between"><span>المجموع الفرعي</span><span>${subtotal.toFixed(2)}</span></div>
          {discount > 0 && <div className="flex justify-between text-sage"><span>الخصم</span><span>-${discount.toFixed(2)}</span></div>}
          <div className="flex justify-between font-bold text-base pt-2 border-t dark:border-white/10"><span>الإجمالي</span><span>${total.toFixed(2)}</span></div>
        </div>

        <button disabled={loading} className="w-full bg-plum text-ivory py-4 rounded-full font-bold disabled:opacity-50">
          {loading ? 'جارٍ إرسال الطلب...' : 'تأكيد الطلب'}
        </button>
      </form>
    </div>
  );
}
