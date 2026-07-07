'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';

const ModelScene = dynamic(() => import('./components/LuxuryModelScene'), { ssr: false });

const CLAMP = (v, min, max) => Math.max(min, Math.min(max, v));

const GALLERY = [
  '/p/2.png', '/p/6.png', '/p/10.png', '/p/15.png',
  '/p/20.png', '/p/25.png', '/p/32.png', '/p/38.png',
];

const MATERIALS = [
  { name: 'Yellow Gold', hex: '#FFCE80', thumb: '/p/2.png'  },
  { name: 'White Gold',  hex: '#F0F2EE', thumb: '/p/10.png' },
  { name: 'Rose Gold',   hex: '#FFB397', thumb: '/p/20.png' },
  { name: 'Platinum',    hex: '#E0E0E2', thumb: '/p/32.png' },
];

const CARE_GOLD = `Gold
Your jewellery is crafted in 18-karat gold — 75% pure gold by composition, alloyed with other metals to achieve the desired colour and durability.

Yellow gold maintains its colour over time with proper care. White gold is rhodium-plated and may reveal its natural tone with wear; re-plating by a professional is recommended when needed. Rose gold develops a subtle patina over time.

Diamonds
Brilliant-cut diamonds can be cleaned with warm water, a small amount of mild soap, and a soft brush. Dry with a lint-free cloth.

General care
Avoid contact with perfume, soap, and cosmetics. Remove before swimming, sport, or household tasks. Store in the provided pouch, away from other pieces. A professional inspection once a year is recommended.`;

const CARE_BRACELET = `Gold
Your jewellery is crafted in 18-karat gold — 75% pure gold by composition.

General care
Avoid contact with perfume, soap, and cosmetics. Remove before swimming, sport, or household tasks. Store in the provided pouch, away from other pieces. A professional inspection once a year is recommended.

Screw fastening system
We recommend seeking assistance to put the bracelet on and take it off. Use the dedicated screwdriver included with your purchase. Check the tightness of the screws regularly.`;

const SHIPPING = `Complimentary shipping on all orders across India. We offer different delivery options — choose the one you prefer at checkout. All orders are fully insured and dispatched in The Vault signature presentation box with a certificate of authenticity.

Estimated delivery: 5–7 business days.`;

const RETURNS = `You may return or exchange your creation within 30 days of delivery. The piece must be in its original, unworn condition and in its original packaging, with all accompanying documentation.

To arrange a return or exchange, contact our client relations team at clientrelations@thevault.in or call +91 22 4678 8888, Monday to Saturday, 10 AM – 7 PM IST.`;

const SERVICE = `Our client relations team is available Monday to Saturday, 10 AM – 7 PM IST.

+91 22 4678 8888
clientrelations@thevault.in

In-person appointments are available at our studio. Book via the button above or contact us directly.`;

const SIZE_NOTE = 'Please note that the carat weight, number of stones and product dimensions will vary based on the size of the creation you order.';

const GROUPS = {
  bracelet: {
    label: 'Bracelets',
    description: 'The Éternelle bracelet in 18-karat yellow gold is secured with a functional screw system — a detail that defines the design and marks a deliberate choice to wear it. It is made to stay on. The proportions are balanced to sit flat against the wrist without bulk.',
    specs: [
      { label: 'Metal',     value: '18K yellow gold (750/1000)' },
      { label: 'Width',     value: '6.1 mm (for size 17)' },
      { label: 'Weight',    value: 'Approx. 30.1 g (for size 17)' },
      { label: 'Closure',   value: 'Screw fastening system, screwdriver included' },
      { label: 'Hallmark',  value: 'BIS 916' },
      { label: 'Reference', value: 'VLT-B6067517' },
    ],
    ref: 'VLT-B6067517',
    care: CARE_BRACELET,
    sizeNote: SIZE_NOTE,
    sizeLabel: 'Bracelet Size', sizeUnit: 'cm',
    sizes: ['15','16','17','18','19','20','21'], defaultSize: '17',
  },
  rings: {
    label: 'Rings',
    price: 'INR 1,96,000',
    description: 'The Éternelle ring in 18-karat yellow gold carries a single brilliant-cut diamond set into the band. The stone is flush-set, so the profile stays low against the hand. The band narrows towards the base — a considered proportional decision that makes it comfortable for everyday wear.',
    specs: [
      { label: 'Metal',         value: '18K yellow gold (750/1000)' },
      { label: 'Diamond',       value: '1 brilliant-cut diamond, approx. 0.22 ct' },
      { label: 'Clarity',       value: 'VVS1, G colour' },
      { label: 'Width',         value: '5.5 mm (for size 52)' },
      { label: 'Weight',        value: 'Approx. 4.1 g (for size 52)' },
      { label: 'Certification', value: 'GIA Certified' },
      { label: 'Hallmark',      value: 'BIS 916' },
      { label: 'Reference',     value: 'VLT-R4084600' },
    ],
    ref: 'VLT-R4084600',
    care: CARE_GOLD,
    sizeNote: SIZE_NOTE,
    sizeLabel: 'Ring Size (EU)', sizeUnit: '',
    sizes: ['46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62'], defaultSize: '52',
  },
  pendants: {
    label: 'Pendants',
    price: 'INR 65,500',
    description: 'The Éternelle pendant in 18-karat yellow gold holds a single brilliant-cut diamond on a fine chain. The motif is kept deliberately small — the stone does the work. The chain can be worn at different lengths to suit neckline and preference.',
    specs: [
      { label: 'Metal',         value: '18K yellow gold (750/1000)' },
      { label: 'Diamond',       value: '1 brilliant-cut diamond, approx. 0.10 ct' },
      { label: 'Motif',         value: '12.8 mm diameter' },
      { label: 'Chain',         value: 'Adjustable, 40–50 cm' },
      { label: 'Weight',        value: 'Approx. 2.3 g' },
      { label: 'Certification', value: 'GIA Certified' },
      { label: 'Hallmark',      value: 'BIS 916' },
      { label: 'Reference',     value: 'VLT-N3153124' },
    ],
    ref: 'VLT-N3153124',
    care: CARE_GOLD,
    sizeNote: null,
    sizeLabel: 'Chain Length', sizeUnit: 'cm',
    sizes: ['40','42','45','50'], defaultSize: '42',
  },
};

// ── Size guide data ──────────────────────────────────────────────────────────
const BRACELET_CM = [
  { wrist: '13–13.9 cm', size: 14 }, { wrist: '14–14.9 cm', size: 15 },
  { wrist: '15–15.9 cm', size: 16 }, { wrist: '16–16.9 cm', size: 17 },
  { wrist: '17–17.9 cm', size: 18 }, { wrist: '18–18.9 cm', size: 19 },
  { wrist: '19–19.9 cm', size: 20 }, { wrist: '20–20.9 cm', size: 21 },
];
const BRACELET_IN = [
  { wrist: '5.1–5.5"', size: 14 }, { wrist: '5.5–5.9"', size: 15 },
  { wrist: '5.9–6.3"', size: 16 }, { wrist: '6.3–6.7"', size: 17 },
  { wrist: '6.7–7.1"', size: 18 }, { wrist: '7.1–7.5"', size: 19 },
  { wrist: '7.5–7.9"', size: 20 }, { wrist: '7.9–8.3"', size: 21 },
];
const RINGS_DATA = [
  { eu: 46, us: '3½', uk: 'F½', dia: '14.6 mm' }, { eu: 47, us: '3¾', uk: 'G',  dia: '15.0 mm' },
  { eu: 48, us: '4',  uk: 'H',  dia: '15.3 mm' }, { eu: 49, us: '4½', uk: 'I',  dia: '15.6 mm' },
  { eu: 50, us: '5',  uk: 'J',  dia: '15.9 mm' }, { eu: 51, us: '5½', uk: 'K',  dia: '16.2 mm' },
  { eu: 52, us: '6',  uk: 'L',  dia: '16.6 mm' }, { eu: 53, us: '6¼', uk: 'M',  dia: '16.9 mm' },
  { eu: 54, us: '6¾', uk: 'M½', dia: '17.2 mm' }, { eu: 55, us: '7',  uk: 'N',  dia: '17.5 mm' },
  { eu: 56, us: '7½', uk: 'O',  dia: '17.8 mm' }, { eu: 57, us: '8',  uk: 'P',  dia: '18.2 mm' },
  { eu: 58, us: '8¼', uk: 'P½', dia: '18.5 mm' }, { eu: 59, us: '8¾', uk: 'Q',  dia: '18.8 mm' },
  { eu: 60, us: '9',  uk: 'R',  dia: '19.1 mm' }, { eu: 61, us: '9½', uk: 'R½', dia: '19.4 mm' },
  { eu: 62, us: '10', uk: 'S',  dia: '19.7 mm' },
];
const PENDANT_CHAINS = [
  { length: '40 cm', pos: 'Sits at the collarbone. Classic, close-to-neck placement.' },
  { length: '42 cm', pos: 'Falls just below the collarbone.' },
  { length: '45 cm', pos: 'Rests at the upper chest. The most versatile length.' },
  { length: '50 cm', pos: 'Longer drop — suits layered or statement looks.' },
];

const TH = { fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1a1a1a', fontWeight: 600 };
const TD = { fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#444' };
const CELL = { padding: '12px 16px', borderRight: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)' };

export default function LuxuryPDPClient({ product }) {
  const group = GROUPS[product?.group] ? product.group : 'rings';
  const gd = GROUPS[group];

  const [mat,           setMat]           = useState(MATERIALS[0]);
  const [open,          setOpen]          = useState(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sgTab,         setSgTab]         = useState('recommended');
  const [sgUnit,        setSgUnit]        = useState('cm');
  const [manualZoom,    setManualZoom]    = useState(1.0);
  const [scrollZoom,    setScrollZoom]    = useState(1.0);
  const [isFullscreen,  setIsFullscreen]  = useState(false);
  const isHovering = useRef(false);
  const viewerRef  = useRef(null);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => {
    let raf;
    const onScroll = () => {
      if (isHovering.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const t = Math.min(Math.max(window.scrollY / (window.innerHeight - 70), 0), 1);
        setScrollZoom(1.0 - t * 0.18);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const modelPath = product?.model ?? '/optimized/bracelet.glb';
  const title = product?.title
    ? product.title.charAt(0).toUpperCase() + product.title.slice(1)
    : 'Éternelle';

  const zoom = manualZoom * scrollZoom;

  const ACCORDION = [
    { id: 'specs',    label: 'Details & Specifications', specs: gd.specs },
    { id: 'care',     label: 'Materials & Care',         content: gd.care },
    { id: 'shipping', label: 'Shipping',                  content: SHIPPING },
    { id: 'returns',  label: 'Returns & Exchanges',       content: RETURNS },
    { id: 'service',  label: 'Client Services',           content: SERVICE },
  ];

  return (
    <div style={{ backgroundColor: '#FAF8F5', color: '#1a1a1a', minHeight: '100vh' }}>
      <style>{`.rp::-webkit-scrollbar{display:none}`}</style>
      <Navbar />

      <div style={{ display: 'grid', gridTemplateColumns: '58% 42%', alignItems: 'start', paddingTop: 70 }}>

        {/* LEFT */}
        <div>
          <div
            ref={viewerRef}
            onMouseEnter={() => { isHovering.current = true; }}
            onMouseLeave={() => { isHovering.current = false; }}
            style={{ height: 'calc(100vh - 70px)', position: 'relative', backgroundColor: '#F5F2ED', borderRight: '1px solid rgba(0,0,0,0.06)' }}
          >
            <Suspense fallback={null}>
              <ModelScene modelPath={modelPath} color={mat.hex} zoom={zoom} />
            </Suspense>

            <button
              onClick={() => document.fullscreenElement ? document.exitFullscreen() : viewerRef.current?.requestFullscreen()}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.12)', cursor: 'pointer', backdropFilter: 'blur(4px)', color: '#1a1a1a' }}
            >
              {isFullscreen
                ? <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 1H1v3M9 1h3v3M12 9v3H9M4 12H1V9"/></svg>
                : <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 4V1h3M9 1h3v3M12 9v3H9M4 12H1V9"/></svg>
              }
            </button>

            <div style={{ position: 'absolute', bottom: 24, right: 20, display: 'flex', flexDirection: 'column', gap: 1, zIndex: 10 }}>
              {[['＋', '+', () => setManualZoom(z => CLAMP(z * 1.25, 0.4, 2.8))], ['－', '−', () => setManualZoom(z => CLAMP(z / 1.25, 0.4, 2.8))]].map(([ch, label, fn]) => (
                <button key={label} onClick={fn} aria-label={label} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.12)', cursor: 'pointer', fontSize: '16px', lineHeight: 1, color: '#1a1a1a', backdropFilter: 'blur(4px)', fontFamily: 'system-ui, sans-serif' }}>{ch}</button>
              ))}
            </div>

            <p style={{ position: 'absolute', bottom: 24, left: 0, right: 60, textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.22)', pointerEvents: 'none', margin: 0 }}>
              Drag to rotate · Scroll to zoom
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
            {GALLERY.map((src, i) => (
              <div key={src} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', borderBottom: '1px solid rgba(0,0,0,0.06)', borderRight: i % 2 === 0 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                <Image src={src} alt="" fill className="object-cover" sizes="29vw" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="rp" style={{ position: 'sticky', top: 70, height: 'calc(100vh - 70px)', overflowY: 'auto', scrollbarWidth: 'none', padding: '40px 44px 60px 44px', display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'rgba(0,0,0,0.38)', letterSpacing: '0.04em', marginBottom: 20 }}>
            The Vault &nbsp;/&nbsp; {gd.label} &nbsp;/&nbsp; {title}
          </p>

          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1a1a1a', lineHeight: 1.3, margin: '0 0 24px' }}>{title}</h1>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 300, color: '#555', lineHeight: 1.85, marginBottom: 24 }}>{gd.description}</p>

          {/* Metal */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', marginBottom: 12 }}>Metal</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {MATERIALS.map((m) => {
                const active = mat.name === m.name;
                return (
                  <button key={m.name} onClick={() => setMat(m)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <div style={{ width: 68, height: 68, position: 'relative', overflow: 'hidden', outline: active ? '2px solid #1a1a1a' : '1px solid rgba(0,0,0,0.12)', outlineOffset: active ? 2 : 0, backgroundColor: '#EFECE6', transition: 'outline 0.15s' }}>
                      <Image src={m.thumb} alt={m.name} fill className="object-cover" sizes="68px" />
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: m.hex, opacity: 0.25 }} />
                    </div>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.06em', color: active ? '#1a1a1a' : 'rgba(0,0,0,0.45)', textAlign: 'center', maxWidth: 68 }}>{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size */}
          <div style={{ marginBottom: 20 }}>
            <button onClick={() => setSizeGuideOpen(true)} style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1a1a1a', background: 'none', border: '1px solid rgba(0,0,0,0.18)', cursor: 'pointer', padding: '11px 20px', width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Find Your Size</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
            </button>
          </div>

          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 400, color: '#1a1a1a', marginBottom: 16, letterSpacing: '-0.01em' }}>{gd.price}</p>

          <div style={{ marginBottom: 24 }}>
            <button
              style={{ width: '100%', padding: '14px 0', fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#2d2d2d'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#1a1a1a'}
            >Contact</button>
          </div>

          <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><path d="M14 10.5c-1 0-2-.2-2.9-.5l-.8.8c-.6.6-1.5.6-2.1.2C6.8 10 5.5 8.7 4.5 7.3c-.4-.6-.3-1.5.3-2l.8-.8C5.3 3.7 5.1 2.7 5.1 1.7c0-.4.3-.7.7-.7h2c.4 0 .7.3.7.7 0 .8.1 1.5.4 2.2l-1 1c.8 1.4 1.9 2.5 3.4 3.4l1-1c.7.3 1.4.4 2.2.4.4 0 .7.3.7.7v2c0 .4-.3.7-.7.7-.1 0-.3 0-.5-.1" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round"/></svg>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a1a1a', lineHeight: 1.6 }}>For more information, please call +91 22 4678 8888</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><rect x="1" y="3" width="14" height="12" rx="1" stroke="#1a1a1a" strokeWidth="1"/><path d="M5 1v4M11 1v4M1 7h14" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round"/></svg>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a1a1a', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>Book an Appointment</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="12" cy="3" r="2" stroke="#1a1a1a" strokeWidth="1"/><circle cx="12" cy="13" r="2" stroke="#1a1a1a" strokeWidth="1"/><circle cx="3" cy="8" r="2" stroke="#1a1a1a" strokeWidth="1"/><path d="M10.5 4l-6 2.5M10.5 12l-6-2.5" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round"/></svg>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a1a1a' }}>Share</span>
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'rgba(0,0,0,0.4)', letterSpacing: '0.04em' }}>Ref. {gd.ref}</span>
            </div>
          </div>

          {/* Accordion */}
          <div>
            {ACCORDION.map(({ id, label, content, specs }) => {
              const isOpen = open === id;
              return (
                <div key={id} style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                  <button onClick={() => setOpen(isOpen ? null : id)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1a' }}>{label}</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 200, color: 'rgba(0,0,0,0.3)', lineHeight: 1, display: 'inline-block', transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.25s' }}>+</span>
                  </button>
                  <div style={{ maxHeight: isOpen ? '800px' : 0, overflow: 'hidden', opacity: isOpen ? 1 : 0, transition: 'max-height 0.4s ease, opacity 0.3s ease' }}>
                    <div style={{ paddingBottom: 20 }}>
                      {specs ? specs.map((s) => (
                        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.38)' }}>{s.label}</span>
                          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', fontWeight: 300, color: 'rgba(0,0,0,0.65)' }}>{s.value}</span>
                        </div>
                      )) : content.split('\n\n').map((block, i) => {
                        const isHeader = block.length < 40 && !block.includes('.');
                        return isHeader
                          ? <p key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1a1a1a', marginTop: i === 0 ? 0 : 20, marginBottom: 8 }}>{block}</p>
                          : <p key={i} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', lineHeight: 1.85, fontWeight: 300, color: '#666', marginBottom: 12 }}>{block.split('\n').map((line, j, arr) => <span key={j}>{line}{j < arr.length - 1 && <br />}</span>)}</p>;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }} />
          </div>
        </div>
      </div>

      {/* Editorial */}
      <section style={{ position: 'relative', height: '90vh', overflow: 'hidden' }}>
        <Image src="/p/9.png" alt="" fill className="object-cover" sizes="100vw" priority />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 72, left: 80 }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>The Vault</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, fontStyle: 'italic', color: '#fff', lineHeight: 1.15, maxWidth: 520 }}>Some things are worth<br />doing properly.</p>
        </div>
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '70vh' }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}><Image src="/p/14.png" alt="" fill className="object-cover" sizes="50vw" /></div>
        <div style={{ position: 'relative', overflow: 'hidden' }}><Image src="/p/22.png" alt="" fill className="object-cover" sizes="50vw" /></div>
      </section>
      <section style={{ backgroundColor: '#FAF8F5', padding: '100px 48px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 300, fontStyle: 'italic', color: '#1a1a1a', lineHeight: 1.3, maxWidth: 700, margin: '0 auto' }}>
          &ldquo;Every piece we make is meant<br />to outlast the occasion that called for it.&rdquo;
        </p>
        <div style={{ width: 32, height: 1, backgroundColor: '#c5a572', margin: '36px auto 24px' }} />
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>The Vault · Est. 2024</p>
      </section>

      <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '20px 44px', display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'rgba(0,0,0,0.3)', letterSpacing: '0.04em' }}>
        <span>© The Vault</span><span>Est. 2024 · India</span>
      </div>

      {/* Size guide modal */}
      {sizeGuideOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
          <div onClick={() => setSizeGuideOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 500, backgroundColor: '#fff', overflowY: 'auto', padding: '36px 44px', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1a1a1a', margin: 0 }}>Size Guide</h2>
              <button onClick={() => setSizeGuideOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#1a1a1a', lineHeight: 1, padding: 4 }}>✕</button>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.1)', marginBottom: 28 }}>
              {[['recommended', 'Recommended Size'], ['yoursize', 'Your Size']].map(([key, label]) => (
                <button key={key} onClick={() => setSgTab(key)} style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '10px 0', marginRight: 28, background: 'none', border: 'none', cursor: 'pointer', color: sgTab === key ? '#1a1a1a' : 'rgba(0,0,0,0.38)', borderBottom: sgTab === key ? '2px solid #1a1a1a' : '2px solid transparent', marginBottom: -1, transition: 'color 0.15s' }}>{label}</button>
              ))}
            </div>

            {sgTab === 'recommended' && (
              <>
                {group === 'bracelet' && (
                  <>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#555', lineHeight: 1.75, marginBottom: 24 }}>Sizing recommendations may vary among our collections. Identify the recommended bracelet size for this model using your wrist circumference.</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1a1a1a', fontWeight: 500 }}>Select Your Size</span>
                      <button onClick={() => setSgUnit(u => u === 'cm' ? 'in' : 'cm')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid rgba(0,0,0,0.18)', cursor: 'pointer', padding: '5px 14px', borderRadius: 20, fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1a' }}>
                        {sgUnit.toUpperCase()}
                        <span style={{ display: 'inline-block', width: 30, height: 16, borderRadius: 8, backgroundColor: '#1a1a1a', position: 'relative', verticalAlign: 'middle' }}>
                          <span style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', backgroundColor: '#fff', top: 3, transition: 'left 0.2s', left: sgUnit === 'in' ? 3 : 17 }} />
                        </span>
                      </button>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', borderLeft: '1px solid rgba(0,0,0,0.08)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px' }}>
                        <div style={{ ...CELL, backgroundColor: '#FAF8F5' }}><span style={TH}>Wrist Circumference</span></div>
                        <div style={{ ...CELL, backgroundColor: '#FAF8F5', textAlign: 'center' }}><span style={TH}>Recommended Size</span></div>
                        {(sgUnit === 'cm' ? BRACELET_CM : BRACELET_IN).map(({ wrist, size }) => (
                          <>
                            <div key={wrist} style={CELL}><span style={TD}>{wrist}</span></div>
                            <div key={size} style={{ ...CELL, textAlign: 'center' }}><span style={{ ...TD, fontWeight: 500, color: '#1a1a1a' }}>{size}</span></div>
                          </>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {group === 'rings' && (
                  <>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#555', lineHeight: 1.75, marginBottom: 24 }}>Cartier uses European ring sizes — inner circumference in mm. Use the conversion table below to find your size across different standards.</p>
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', borderLeft: '1px solid rgba(0,0,0,0.08)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '60px 80px 80px 100px' }}>
                        {['EU', 'US', 'UK', 'Diameter'].map(h => (
                          <div key={h} style={{ ...CELL, backgroundColor: '#FAF8F5', textAlign: 'center' }}><span style={TH}>{h}</span></div>
                        ))}
                        {RINGS_DATA.map(({ eu, us, uk, dia }) => (
                          <>
                            <div key={eu + 'e'} style={{ ...CELL, textAlign: 'center' }}><span style={{ ...TD, fontWeight: 600, color: '#1a1a1a' }}>{eu}</span></div>
                            <div key={eu + 'u'} style={{ ...CELL, textAlign: 'center' }}><span style={TD}>{us}</span></div>
                            <div key={eu + 'k'} style={{ ...CELL, textAlign: 'center' }}><span style={TD}>{uk}</span></div>
                            <div key={eu + 'd'} style={{ ...CELL, textAlign: 'center' }}><span style={TD}>{dia}</span></div>
                          </>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {group === 'pendants' && (
                  <>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#555', lineHeight: 1.75, marginBottom: 24 }}>Chain length is measured from clasp to clasp. The pendant hangs at the midpoint. Different lengths suit different necklines and styling preferences.</p>
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', borderLeft: '1px solid rgba(0,0,0,0.08)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr' }}>
                        {['Length', 'Position'].map(h => (
                          <div key={h} style={{ ...CELL, backgroundColor: '#FAF8F5' }}><span style={TH}>{h}</span></div>
                        ))}
                        {PENDANT_CHAINS.map(({ length, pos }) => (
                          <>
                            <div key={length} style={CELL}><span style={{ ...TD, fontWeight: 500, color: '#1a1a1a' }}>{length}</span></div>
                            <div key={pos} style={CELL}><span style={TD}>{pos}</span></div>
                          </>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {sgTab === 'yoursize' && (
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#555', lineHeight: 1.75, marginBottom: 20 }}>
                  {group === 'bracelet'
                    ? 'Measure the circumference of your wrist using a flexible tape measure or a strip of paper. Wrap it around the widest part of your wrist, mark where it overlaps, and measure the length. Add 1–2 cm for a comfortable fit.'
                    : group === 'rings'
                    ? 'Measure the circumference of your finger using a thin strip of paper or string. Wrap it around the base of your finger, mark where it meets, and measure the length in mm. This measurement is your European ring size.'
                    : 'Measure from the back of your neck down to where you would like the pendant to sit. A standard collarbone-length necklace is approximately 40–42 cm.'}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(0,0,0,0.38)', lineHeight: 1.75 }}>
                  For a precise fitting, we recommend visiting our studio. Contact our client relations team at +91 22 4678 8888, Monday to Saturday, 10 AM – 7 PM IST.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
