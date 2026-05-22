'use client';

import { useRef, useEffect, useState, Suspense, Component, useMemo } from 'react';
import Image from 'next/image';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Different model paths per section to avoid sharing WebGL scenes across canvases
useGLTF.preload('/ring.glb');
useGLTF.preload('/bracelet3.glb');
useGLTF.preload('/ring2.glb');
useGLTF.preload('/pendant.glb');

// Large editorial shots only — confirmed by file size > 1.5MB
// 6, 8, 10, 12, 14, 16, 18, 20, 23, 26, 28, 30, 32, 35, 38
const EDITORIAL = [6, 8, 10, 12, 14, 16, 18, 20, 23, 26, 28, 30, 32, 35, 38];

// ─── Error boundary ───────────────────────────────────────────────────────────
class CanvasBoundary extends Component {
  state = { dead: false };
  static getDerivedStateFromError() { return { dead: true }; }
  render() { return this.state.dead ? null : this.props.children; }
}

// ─── 3D Models ────────────────────────────────────────────────────────────────
// baseRx tilts the model so bracelets show their oval form instead of a flat bar
function HeroModel({ path, scale = 1, scrollProgress }) {
  const { scene } = useGLTF(path);
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const sp = scrollProgress?.get() ?? 0;
    ref.current.rotation.y = t * 0.22 + sp * 1.2;
    ref.current.rotation.x = Math.sin(t * 0.35) * 0.08;
    ref.current.position.y = Math.sin(t * 0.6) * 0.06;
  });
  return <group ref={ref}><primitive object={scene} scale={scale} /></group>;
}

function ScrollModel({ path, scale = 1, scrollProgress, baseRx = 0 }) {
  const { scene } = useGLTF(path);
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const sp = scrollProgress?.get() ?? 0;
    ref.current.rotation.x = baseRx;
    ref.current.rotation.y = sp * Math.PI * 2;
    ref.current.position.y = Math.sin(t * 0.7) * 0.038;
  });
  return <group ref={ref}><primitive object={scene} scale={scale} /></group>;
}

// ─── Shared canvas config ─────────────────────────────────────────────────────
function JewelCanvas({ children, cameraZ = 5 }) {
  return (
    <CanvasBoundary>
      <Canvas
        camera={{ position: [0, 0.3, cameraZ], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 7, 5]} intensity={2.1} color="#fff6e8" />
        <directionalLight position={[-3, 0, -2]} intensity={0.4} color="#ffecd0" />
        <Suspense fallback={null}>
          <Environment files="/final.hdr" />
          {children}
        </Suspense>
      </Canvas>
    </CanvasBoundary>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function VaultNav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY.current) < 4) return;
      setHidden(y > lastY.current && y > 100);
      setScrolled(y > 60);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      animate={{ y: hidden ? -80 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.36, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '22px 56px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: scrolled ? 'rgba(250,248,245,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'rgba(26,26,26,0.07)' : 'transparent'}`,
        transition: 'background 0.5s ease, border-color 0.5s ease',
      }}
    >
      <Image src="/croppedlogo.png" alt="The Vault" width={84} height={32} style={{ objectFit: 'contain' }} />
      <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
        {['COLLECTIONS', 'ABOUT', 'CONTACT'].map(item => (
          <a key={item} href="#" className="font-montserrat" style={{
            fontSize: '10px', letterSpacing: '0.26em', color: '#1A1A1A',
            opacity: 0.55, textDecoration: 'none',
          }}>
            {item}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-16%']);

  return (
    <section ref={ref} style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#F5F2EE' }}>

      {/* Parallax bg image */}
      <motion.div style={{
        position: 'absolute', top: '-22%', left: 0, right: 0, bottom: '-22%',
        y: imageY,
      }}>
        <Image src="/p/10.png" alt="" fill priority
          style={{ objectFit: 'cover', objectPosition: 'center 25%' }} />
      </motion.div>

      {/* Left-to-right gradient — keeps text legible over the image */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(100deg, rgba(245,242,238,0.72) 0%, rgba(245,242,238,0.18) 55%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
        background: 'linear-gradient(to top, rgba(245,242,238,0.65) 0%, transparent 100%)',
      }} />

      {/* 3D ring — right side floats over the image */}
      <div style={{
        position: 'absolute', right: '4%', top: '8%',
        width: '42%', height: '84%', zIndex: 2,
      }}>
        <JewelCanvas cameraZ={4.8}>
          <HeroModel path="/ring.glb" scale={1.1} scrollProgress={scrollYProgress} />
        </JewelCanvas>
      </div>

      {/* Hero copy */}
      <div style={{
        position: 'absolute', left: '8%', top: '50%',
        transform: 'translateY(-50%)', zIndex: 3, maxWidth: '42%',
      }}>
        <motion.div style={{ opacity: textOpacity, y: textY }}>
          <motion.p className="font-montserrat"
            style={{ fontSize: '9px', letterSpacing: '0.42em', color: 'rgba(26,26,26,0.6)', marginBottom: '24px' }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
          >
            THE VAULT
          </motion.p>

          <motion.h1 className="font-cormorant"
            style={{ fontSize: 'clamp(58px, 8.5vw, 118px)', fontWeight: 300, lineHeight: 0.87, color: '#1A1A1A', margin: 0 }}
            initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            Crafted<br />for<br />Eternity
          </motion.h1>

          <motion.div
            style={{ width: '44px', height: '1px', background: '#C9996B', margin: '30px 0 22px' }}
            initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 1.15 }}
          />
          <motion.p className="font-montserrat"
            style={{ fontSize: '11px', letterSpacing: '0.22em', color: 'rgba(26,26,26,0.48)', fontStyle: 'italic' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            by Karan Desai
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll pulse */}
      <div style={{
        position: 'absolute', bottom: '38px', left: '50%',
        transform: 'translateX(-50%)', zIndex: 3, textAlign: 'center',
      }}>
        <motion.div
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
        >
          <div style={{ width: '1px', height: '50px', background: '#1A1A1A', margin: '0 auto 10px' }} />
          <p className="font-montserrat" style={{ fontSize: '8px', letterSpacing: '0.42em', color: '#888' }}>SCROLL</p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Statement ────────────────────────────────────────────────────────────────
function StatementSection() {
  return (
    <section style={{
      minHeight: '50vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '110px 48px', background: '#FAF8F5',
    }}>
      <motion.blockquote className="font-cormorant"
        style={{
          fontSize: 'clamp(22px, 3.2vw, 48px)', fontStyle: 'italic',
          fontWeight: 300, textAlign: 'center', color: '#1A1A1A',
          maxWidth: '720px', lineHeight: 1.5, margin: 0,
        }}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        "Crafted to endure.<br />Worn to be remembered."
      </motion.blockquote>
      <motion.div
        style={{ width: '64px', height: '1px', background: '#C9996B', marginTop: '38px' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.38 }}
      />
    </section>
  );
}

// ─── Collection Section ───────────────────────────────────────────────────────
function CollectionSection({
  modelPath, modelScale = 1, modelBaseRx = 0,
  imageSrc, category, title, description, reverse,
}) {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 65, damping: 22 });
  const imageY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);

  return (
    <section ref={ref} style={{
      minHeight: '100vh', display: 'grid',
      gridTemplateColumns: reverse ? '38% 62%' : '62% 38%',
      background: '#FAF8F5', overflow: 'hidden',
    }}>
      {/* ── Image panel ── */}
      <div style={{
        order: reverse ? 2 : 1,
        position: 'relative', overflow: 'hidden', minHeight: '100vh',
      }}>
        <motion.div style={{
          y: imageY,
          position: 'absolute', top: '-12%', left: 0, right: 0, bottom: '-12%',
        }}>
          <Image src={imageSrc} alt={title} fill style={{ objectFit: 'cover', objectPosition: 'center top' }} />
        </motion.div>
      </div>

      {/* ── 3D + text panel ── */}
      <div style={{
        order: reverse ? 1 : 2,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'flex-start',
        padding: '80px 56px',
        background: '#FAF8F5',
      }}>
        {/* 3D jewel preview */}
        <div style={{ width: '100%', height: '300px', marginBottom: '52px', flexShrink: 0 }}>
          <JewelCanvas cameraZ={4.6}>
            <ScrollModel
              path={modelPath}
              scale={modelScale}
              scrollProgress={smooth}
              baseRx={modelBaseRx}
            />
          </JewelCanvas>
        </div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%' }}
        >
          <p className="font-montserrat"
            style={{ fontSize: '9px', letterSpacing: '0.46em', color: '#AAA', marginBottom: '14px' }}>
            {category}
          </p>
          <h2 className="font-cormorant"
            style={{ fontSize: 'clamp(30px, 3.4vw, 48px)', fontWeight: 300, color: '#1A1A1A', lineHeight: 1.12, marginBottom: '16px' }}>
            {title}
          </h2>
          <div style={{ width: '36px', height: '1px', background: '#C9996B', marginBottom: '20px' }} />
          <p className="font-inter"
            style={{ fontSize: '14px', lineHeight: 1.9, color: '#777', maxWidth: '320px', marginBottom: '36px' }}>
            {description}
          </p>
          <a href="#" className="font-montserrat" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '9px', letterSpacing: '0.26em', color: '#1A1A1A',
            borderBottom: '1px solid rgba(26,26,26,0.35)', paddingBottom: '4px',
            textDecoration: 'none',
          }}>
            EXPLORE
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Editorial Grid ───────────────────────────────────────────────────────────
function GridImage({ src, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden', aspectRatio: '2/3', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.8, delay }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        filter: hovered ? 'grayscale(0%) brightness(1.03)' : 'grayscale(100%)',
        transform: hovered ? 'scale(1.045)' : 'scale(1)',
        transition: 'filter 0.75s ease, transform 0.75s ease',
      }}>
        <Image src={src} alt="" fill style={{ objectFit: 'cover' }} />
      </div>
    </motion.div>
  );
}

function EditorialGrid() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const c1 = useTransform(scrollYProgress, [0, 1], ['0px', '-56px']);
  const c2 = useTransform(scrollYProgress, [0, 1], ['60px', '-72px']);
  const c3 = useTransform(scrollYProgress, [0, 1], ['-20px', '-40px']);

  // Only large editorial shots (2MB+)
  const col1 = [6, 14, 23, 32].map(n => `/p/${n}.png`);
  const col2 = [8, 18, 26, 35].map(n => `/p/${n}.png`);
  const col3 = [12, 20, 30].map(n => `/p/${n}.png`);

  return (
    <section ref={ref} style={{ padding: '130px 56px 150px', background: '#FAF8F5', overflow: 'hidden' }}>
      <motion.div
        style={{ textAlign: 'center', marginBottom: '88px' }}
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.9 }}
      >
        <p className="font-montserrat"
          style={{ fontSize: '9px', letterSpacing: '0.56em', color: '#AAA', marginBottom: '18px' }}>
          THE EDIT
        </p>
        <div style={{ width: '32px', height: '1px', background: '#C9996B', margin: '0 auto' }} />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.12fr 0.88fr', gap: '18px', alignItems: 'start' }}>
        <motion.div style={{ y: c1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {col1.map((src, i) => <GridImage key={src} src={src} delay={i * 0.05} />)}
        </motion.div>
        <motion.div style={{ y: c2, display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '70px' }}>
          {col2.map((src, i) => <GridImage key={src} src={src} delay={i * 0.05} />)}
        </motion.div>
        <motion.div style={{ y: c3, display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '-24px' }}>
          {col3.map((src, i) => <GridImage key={src} src={src} delay={i * 0.05} />)}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Craftsmanship ────────────────────────────────────────────────────────────
function CraftsmanshipSection() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  return (
    <section ref={ref} style={{
      minHeight: '80vh', display: 'grid',
      gridTemplateColumns: '42% 58%',
      background: '#FAF8F5', overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '80px 52px 80px 80px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-montserrat"
            style={{ fontSize: '9px', letterSpacing: '0.46em', color: '#AAA', marginBottom: '26px' }}>
            THE CRAFT
          </p>
          <h2 className="font-cormorant"
            style={{ fontSize: 'clamp(34px, 4.2vw, 56px)', fontWeight: 300, lineHeight: 1.08, color: '#1A1A1A', marginBottom: '22px' }}>
            Precision in<br />every detail.
          </h2>
          <div style={{ width: '36px', height: '1px', background: '#C9996B', marginBottom: '22px' }} />
          <p className="font-inter"
            style={{ fontSize: '14px', lineHeight: 1.9, color: '#777', marginBottom: '48px' }}>
            Each piece in The Vault is designed to transcend seasons. Crafted from the finest materials, shaped by hands that understand the geometry of beauty.
          </p>
          <a href="#" className="font-montserrat" style={{
            fontSize: '9px', letterSpacing: '0.26em', color: '#1A1A1A',
            borderBottom: '1px solid rgba(26,26,26,0.35)', paddingBottom: '4px',
            textDecoration: 'none',
          }}>
            EXPLORE THE COLLECTION
          </a>
        </motion.div>
      </div>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <motion.div style={{
          y: imageY, position: 'absolute',
          top: '-14%', left: 0, right: 0, bottom: '-14%',
        }}>
          <Image src="/p/28.png" alt="Craftsmanship" fill style={{ objectFit: 'cover' }} />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function VaultFooter() {
  return (
    <footer style={{ background: '#0E0E0E', padding: '96px 56px 64px', textAlign: 'center' }}>
      <Image src="/croppedlogo.png" alt="The Vault" width={92} height={36}
        style={{ objectFit: 'contain', filter: 'invert(1) brightness(1.8)', opacity: 0.82, marginBottom: '56px' }} />
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '56px', marginBottom: '60px' }}>
        {['COLLECTIONS', 'ABOUT US', 'CONTACT'].map(link => (
          <a key={link} href="#" className="font-montserrat" style={{
            fontSize: '9px', letterSpacing: '0.28em',
            color: 'rgba(255,255,255,0.38)', textDecoration: 'none',
          }}>
            {link}
          </a>
        ))}
      </nav>
      <div style={{ width: '32px', height: '1px', background: 'rgba(201,153,107,0.38)', margin: '0 auto 30px' }} />
      <p className="font-inter" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>
        © 2024 THE VAULT by Karan Desai. All rights reserved.
      </p>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VaultV6() {
  return (
    <>
      <VaultNav />
      <main style={{ background: '#FAF8F5' }}>
        <HeroSection />

        <StatementSection />

        {/* Bracelets — model tilted on X to show the oval band form, not flat bar */}
        <CollectionSection
          modelPath="/bracelet3.glb"
          modelScale={1.05}
          modelBaseRx={Math.PI * 0.38}
          imageSrc="/p/12.png"
          category="BRACELETS"
          title="Full Oval Bracelet"
          description="A sleek, continuous band of rose gold that wraps the wrist in quiet confidence. Minimal by design, enduring by craft."
          reverse={false}
        />

        <CollectionSection
          modelPath="/ring2.glb"
          modelScale={1.1}
          modelBaseRx={Math.PI * 0.08}
          imageSrc="/p/16.png"
          category="RINGS"
          title="The Signature Ring"
          description="Geometric precision meets organic warmth. Each ring is a study in restraint — form distilled to its most essential truth."
          reverse={true}
        />

        <CollectionSection
          modelPath="/pendant.glb"
          modelScale={1.6}
          modelBaseRx={0}
          imageSrc="/p/23.png"
          category="PENDANTS"
          title="Sculptural Pendant"
          description="An abstract form suspended at the neckline. Drawn from nature, refined through craft, designed to be passed down."
          reverse={false}
        />

        <EditorialGrid />

        <CraftsmanshipSection />

        <VaultFooter />
      </main>
    </>
  );
}
