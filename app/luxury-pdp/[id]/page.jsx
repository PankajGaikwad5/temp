import { data } from '@/components/data';
import LuxuryPDPClient from './LuxuryPDPClient';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return data.map((product) => ({
    id: product.id,
  }));
}

export default function LuxuryPDPPage({ params }) {
  const product = data.find((p) => p.id === params.id);
  if (!product) notFound();
  return <LuxuryPDPClient product={product} />;
}
