'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage({ params }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    supabase
      .from('products')
      .select('*, product_images(url, sort_order)')
      .eq('id', params.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const images = (data.product_images || []).sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url);
          setProduct({ ...data, images });
        }
      });
  }, [params.id]);

  if (!product) return <p className="text-gray-400">جارٍ التحميل...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl text-plum dark:text-ivory mb-8">تعديل المنتج</h1>
      <ProductForm initial={product} productId={params.id} />
    </div>
  );
}
