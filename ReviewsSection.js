'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError('بيانات الدخول غير صحيحة.'); return; }
    router.push('/account');
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-24">
      <h1 className="font-display text-3xl text-plum dark:text-ivory mb-8 text-center">تسجيل الدخول</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input required type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        <input required type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-plum text-ivory py-3 rounded-full font-bold disabled:opacity-50">
          {loading ? '...' : 'دخول'}
        </button>
      </form>
      <p className="text-center text-sm mt-6 dark:text-ivory/70">
        ليس لديكِ حساب؟ <Link href="/register" className="text-rose font-bold">أنشئي حساب</Link>
      </p>
    </div>
  );
}
