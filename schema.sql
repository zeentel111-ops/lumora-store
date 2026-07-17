export const metadata = { title: 'سياسة الخصوصية والشروط' };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <h1 className="font-display text-4xl text-plum dark:text-ivory mb-8">سياسة الخصوصية والشروط</h1>

      <div className="space-y-8 text-charcoal/80 dark:text-ivory/80 leading-8">
        <section>
          <h2 className="font-bold text-lg text-plum dark:text-ivory mb-2">جمع المعلومات</h2>
          <p>نجمع فقط المعلومات الضرورية لإتمام طلبكِ: الاسم، رقم الهاتف، والعنوان. لا نشارك بياناتكِ مع أي جهة خارجية.</p>
        </section>
        <section>
          <h2 className="font-bold text-lg text-plum dark:text-ivory mb-2">الطلبات والدفع</h2>
          <p>حاليًا نعتمد الدفع عند الاستلام. سيتم التواصل معكِ هاتفيًا لتأكيد الطلب قبل الشحن.</p>
        </section>
        <section>
          <h2 className="font-bold text-lg text-plum dark:text-ivory mb-2">الاسترجاع والاستبدال</h2>
          <p>يمكن استرجاع أو استبدال المنتج خلال 7 أيام من الاستلام، بشرط أن يكون غير مستخدم وبعبوته الأصلية.</p>
        </section>
        <section>
          <h2 className="font-bold text-lg text-plum dark:text-ivory mb-2">حقوق المستخدم</h2>
          <p>لكِ الحق بطلب حذف حسابكِ وبياناتكِ في أي وقت عبر التواصل معنا مباشرة.</p>
        </section>
      </div>
    </div>
  );
}
