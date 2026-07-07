'use client';
import Image from 'next/image';

export default function LuxuryEditorial() {
  return (
    <>
      {/* 01 · Full-bleed hero */}
      <section style={{ position: 'relative', height: '90vh', overflow: 'hidden' }}>
        <Image src="/p/9.png" alt="" fill className="object-cover" sizes="100vw" priority />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 72, left: 80 }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>
            The Vault
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, fontStyle: 'italic', color: '#fff', lineHeight: 1.15, maxWidth: 520 }}>
            Some things are worth<br />doing properly.
          </p>
        </div>
      </section>

      {/* 02 · Two images side by side */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '70vh' }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Image src="/p/14.png" alt="" fill className="object-cover" sizes="50vw" />
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Image src="/p/22.png" alt="" fill className="object-cover" sizes="50vw" />
        </div>
      </section>

      {/* 03 · Statement quote */}
      <section style={{ backgroundColor: '#FAF8F5', padding: '100px 48px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 300, fontStyle: 'italic', color: '#1a1a1a', lineHeight: 1.3, maxWidth: 700, margin: '0 auto' }}>
          &ldquo;Every piece we make is meant<br />to outlast the occasion that called for it.&rdquo;
        </p>
        <div style={{ width: 32, height: 1, backgroundColor: '#c5a572', margin: '36px auto 24px' }} />
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>
          The Vault · Est. 2024
        </p>
      </section>
    </>
  );
}
