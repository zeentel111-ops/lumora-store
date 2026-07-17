'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (err) { setError('صار خطأ، تأكدي من صحة البيانات.'); setLoading(false); return; }

    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, full_name: form.name, phone: form.phone });
    }
    setLoading(false);
    router.push('/account');
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-24">
      <h1 className="font-display text-3xl text-plum dark:text-ivory mb-8 text-center">إنشاء حساب جديد</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input required name="name" placeholder="الاسم الكامل" value={form.name} onChange={onChange} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        <input required name="phone" placeholder="رقم الهاتف" value={form.phone} onChange={onChange} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        <input required type="email" name="email" placeholder="البريد الإلكتروني" value={form.email} onChange={onChange} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        <input required type="password" name="password" placeholder="كلمة المرور" value={form.password} onChange={onChange} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-plum text-ivory py-3 rounded-full font-bold disabled:opacity-50">
          {loading ? '...' : 'إنشاء الحساب'}
        </button>
      </form>
      <p className="text-center text-sm mt-6 dark:text-ivory/70">
        عندكِ حساب أصلًا؟ <Link href="/login" className="text-rose font-bold">سجّلي دخول</Link>
      </p>
    </div>
  );
}
