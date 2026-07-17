'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const insta = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER;

  return (
    <div className="max-w-2xl mx-auto px-5 py-16">
      <h1 className="font-display text-4xl text-plum dark:text-ivory mb-4 text-center">تواصلي معنا</h1>
      <p className="text-center text-gray-500 mb-10">حابين نسمع رأيكِ أو نساعدكِ باختيار منتجكِ المناسب.</p>

      <div className="grid grid-cols-3 gap-4 mb-12">
        {whatsapp && (
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener" className="bg-[#25D366]/10 text-center rounded-2xl p-5 hover:-translate-y-1 transition">
            <div className="text-3xl mb-2">💬</div>
            <span className="text-sm font-bold dark:text-ivory">واتساب</span>
          </a>
        )}
        {insta && (
          <a href={insta} target="_blank" rel="noopener" className="bg-rose/10 text-center rounded-2xl p-5 hover:-translate-y-1 transition">
            <div className="text-3xl mb-2">📸</div>
            <span className="text-sm font-bold dark:text-ivory">انستغرام</span>
          </a>
        )}
        {phone && (
          <a href={`tel:${phone}`} className="bg-sage/10 text-center rounded-2xl p-5 hover:-translate-y-1 transition">
            <div className="text-3xl mb-2">📞</div>
            <span className="text-sm font-bold dark:text-ivory">اتصال مباشر</span>
          </a>
        )}
      </div>

      {sent ? (
        <p className="text-center text-sage font-bold">شكراً لتواصلكِ معنا! سنرد عليكِ قريبًا.</p>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
          <input required placeholder="اسمكِ" className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
          <input required placeholder="رقم الهاتف أو البريد الإلكتروني" className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
          <textarea required placeholder="رسالتكِ" rows={4} className="w-full rounded-xl px-4 py-3 border dark:bg-white/10 dark:text-ivory" />
          <button className="w-full bg-plum text-ivory py-3 rounded-full font-bold">إرسال</button>
        </form>
      )}
    </div>
  );
}
