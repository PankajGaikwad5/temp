import ProductDetailClient from './ProductDetailClient';
import { data } from '@/components/data';

export async function generateStaticParams() {
  return data.map((product) => ({
    id: product.id,
  }));
}

export default function ProductDetailPage({ params }) {
  const product = data.find((p) => p.id === params.id);

  if (!product) return <p>Product not found</p>;

  return <ProductDetailClient product={product} />;
}
