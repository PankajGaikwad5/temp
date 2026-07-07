'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Fraunces, Space_Grotesk } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['italic', 'normal'],
  variable: '--font-fraunces',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
});

export default function RootHomePage() {
  const router = useRouter();

  // DOM Refs
  const stageRef = useRef(null);
  const lpRef = useRef(null);
  const dpRef = useRef(null);
  const seamPathRef = useRef(null);
  const seamLinePRef = useRef(null);
  const lpPendantRef = useRef(null);
  const dpPendantRef = useRef(null);
  const wipeRef = useRef(null);
  const wipeWordRef = useRef(null);

  // Math/Physics refs to share with the render loop without triggering React re-renders
  const stateRef = useRef({
    split: 0.5,
    target: 0.5,
    hover: 0, // -1: Statement (left), +1: Streetwear (right), 0: Center
    mx: 0,    // Parallax X (-1..1)
    my: 0,    // Parallax Y (-1..1)
  });

  const animStateRef = useRef({
    rx: 0,
    ry: 0,
    tx: 0,
    ty: 0,
    lx: 0,
  });

  useEffect(() => {
    const stage = stageRef.current;
    const lp = lpRef.current;
    const dp = dpRef.current;
    const seamPath = seamPathRef.current;
    const seamLineP = seamLinePRef.current;
    const wipe = wipeRef.current;

    if (!stage || !lp || !dp || !seamPath || !seamLineP || !wipe) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let vertical = W > 820;

    // Split shape calculations
    const pathFor = (s) => {
      const amp = Math.min(W, H) * 0.075;
      if (vertical) {
        const x = s * W;
        return {
          clip: `M${x} 0 C${x - amp} ${H * 0.33} ${x + amp} ${H * 0.66} ${x} ${H} L${W} ${H} L${W} 0 Z`,
          line: `M${x} 0 C${x - amp} ${H * 0.33} ${x + amp} ${H * 0.66} ${x} ${H}`
        };
      } else {
        const y = s * H;
        return {
          clip: `M0 ${y} C${W * 0.33} ${y - amp} ${W * 0.66} ${y + amp} ${W} ${y} L${W} ${H} L0 ${H} Z`,
          line: `M0 ${y} C${W * 0.33} ${y - amp} ${W * 0.66} ${y + amp} ${W} ${y}`
        };
      }
    };

    const drawSeam = () => {
      const p = pathFor(stateRef.current.split);
      seamPath.setAttribute('d', p.clip);
      seamLineP.setAttribute('d', p.line);
    };

    // Hover state toggles
    const setActive = (side) => {
      lp.classList.toggle('active', side === 'L');
      lp.classList.toggle('dim', side === 'R');
      dp.classList.toggle('active', side === 'R');
      dp.classList.toggle('dim', side === 'L');

      stateRef.current.target = side === 'L' ? 0.63 : side === 'R' ? 0.37 : 0.5;
      stateRef.current.hover = side === 'L' ? -1 : side === 'R' ? 1 : 0;
    };

    // Pointer event listeners
    const onLpEnter = () => {
      stage.classList.add('touched');
      setActive('L');
    };

    const onDpEnter = () => {
      stage.classList.add('touched');
      setActive('R');
    };

    const onStageLeave = () => {
      setActive(null);
    };

    const onPointerMove = (e) => {
      stateRef.current.mx = (e.clientX / W) * 2 - 1;
      stateRef.current.my = (e.clientY / H) * 2 - 1;
    };

    lp.addEventListener('pointerenter', onLpEnter);
    dp.addEventListener('pointerenter', onDpEnter);
    stage.addEventListener('pointerleave', onStageLeave);
    stage.addEventListener('pointermove', onPointerMove);

    // Handle resizing
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      vertical = W > 820;
      document.getElementById('seamline')?.setAttribute('viewBox', `0 0 ${W} ${H}`);
      drawSeam();
    };

    window.addEventListener('resize', resize);
    resize();

    // Render loop
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    let tPrev = 0;
    let animationFrameId;

    const loop = (t) => {
      const dt = Math.min((t - tPrev) / 1000, 0.05);
      tPrev = t;

      // Update split line positions
      stateRef.current.split += (stateRef.current.target - stateRef.current.split) * Math.min(dt * 6, 1);
      drawSeam();

      // 3D Parallax Tilt on the pendant image (with smooth physics easing)
      const targetRx = stateRef.current.my * -12; // tilt max 12deg
      const targetRy = stateRef.current.mx * 12;
      const targetTx = stateRef.current.mx * 15;  // translation max 15px
      const targetTy = stateRef.current.my * 15;
      const targetLx = stateRef.current.hover * 22; // slide horizontally toward active side

      // Interpolate with smooth easing factor (e.g., 0.08)
      animStateRef.current.rx += (targetRx - animStateRef.current.rx) * 0.08;
      animStateRef.current.ry += (targetRy - animStateRef.current.ry) * 0.08;
      animStateRef.current.tx += (targetTx - animStateRef.current.tx) * 0.08;
      animStateRef.current.ty += (targetTy - animStateRef.current.ty) * 0.08;
      animStateRef.current.lx += (targetLx - animStateRef.current.lx) * 0.06;

      const breathe = reduce ? 0 : Math.sin(t * 0.0015) * 0.02;
      const scale = 1 + breathe;

      const transformStr = `translate3d(calc(-50% + ${animStateRef.current.tx + animStateRef.current.lx}px), calc(-50% + ${animStateRef.current.ty}px), 0) rotateX(${animStateRef.current.rx}deg) rotateY(${animStateRef.current.ry}deg) scale(${scale})`;

      if (lpPendantRef.current) lpPendantRef.current.style.transform = transformStr;
      if (dpPendantRef.current) dpPendantRef.current.style.transform = transformStr;

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    // Cleanups on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      lp.removeEventListener('pointerenter', onLpEnter);
      dp.removeEventListener('pointerenter', onDpEnter);
      stage.removeEventListener('pointerleave', onStageLeave);
      stage.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  const enter = (name) => {
    if (!wipeRef.current || !wipeWordRef.current) return;

    wipeWordRef.current.textContent = name;
    wipeRef.current.style.backgroundColor = name === 'Statement' ? 'var(--ivory)' : 'var(--noir)';
    wipeWordRef.current.style.color = name === 'Statement' ? '#1c1813' : 'var(--gold-soft)';
    wipeRef.current.style.opacity = '1';
    wipeRef.current.style.pointerEvents = 'auto'; // Prevent clicking while page changes

    setTimeout(() => {
      // Transition route to different collections representing each world
      if (name === 'Statement') {
        router.push('/home'); // Routes to the existing Interactive Carousel Home Page
      } else {
        router.push('/streetwear'); // Routes to the new Streetwear template page
      }
    }, 800);
  };

  const handlePanelClick = (e, name, side) => {
    const isMobile = window.innerWidth <= 820;
    const lp = lpRef.current;
    const dp = dpRef.current;
    const isActive = (side === 'L' && lp?.classList.contains('active')) ||
                     (side === 'R' && dp?.classList.contains('active'));

    if (isMobile && !isActive) {
      e.stopPropagation();
      e.preventDefault();
      
      // Toggle active states on mobile
      lp.classList.toggle('active', side === 'L');
      lp.classList.toggle('dim', side === 'R');
      dp.classList.toggle('active', side === 'R');
      dp.classList.toggle('dim', side === 'L');

      stateRef.current.target = side === 'L' ? 0.63 : side === 'R' ? 0.37 : 0.5;
      stateRef.current.hover = side === 'L' ? -1 : side === 'R' ? 1 : 0;
      stageRef.current.classList.add('touched');
      return;
    }

    enter(name);
  };

  return (
    <div className={`vault-landing ${fraunces.variable} ${spaceGrotesk.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .vault-landing {
          --ivory: #ece6d8;
          --ink-soft: #1c1813;
          --noir: #0c0b0a;
          --gold: #c9a64e;
          --gold-soft: #e7cf8f;
          background: var(--noir);
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          position: relative;
        }

        .vault-landing * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        #stage {
          position: fixed;
          inset: 0;
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
          perspective: 1000px; /* Enable 3D depth perspective */
        }

        .panel {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          will-change: clip-path;
        }

        .light {
          z-index: 1;
          background: var(--ivory);
          color: var(--ink-soft);
          padding-left: 6vw;
        }

        .dark {
          z-index: 2;
          background: var(--noir);
          color: #f2ede1;
          align-items: flex-end;
          padding-right: 6vw;
          text-align: right;
          clip-path: url(#seam);
        }

        .kicker {
          font-family: var(--font-space-grotesk), 'Space Grotesk', sans-serif;
          font-weight: 500;
          font-size: 12px;
          line-height: 1;
          letter-spacing: .42em;
          text-transform: uppercase;
          opacity: .55;
          margin-bottom: 18px;
        }

        .light .kicker {
          color: #7a6a4a;
        }

        .dark .kicker {
          color: var(--gold);
        }

        .title {
          transition: transform .55s cubic-bezier(.16,1,.3,1), letter-spacing .55s;
        }

        .light .title {
          font-family: var(--font-fraunces), 'Fraunces', serif;
          font-weight: 300;
          font-size: clamp(44px, 9vw, 128px);
          line-height: .92;
          letter-spacing: -.01em;
          font-style: italic;
        }

        .dark .title {
          font-family: var(--font-space-grotesk), 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(40px, 8.4vw, 116px);
          line-height: .9;
          letter-spacing: -.03em;
          text-transform: uppercase;
        }

        .sub {
          margin-top: 20px;
          max-width: 30ch;
          opacity: .7;
          font-size: 15px;
          transition: opacity .5s, transform .5s;
        }

        .light .sub {
          font-family: var(--font-fraunces), 'Fraunces', serif;
          font-weight: 400;
          font-size: 16px;
          line-height: 1.5;
          font-style: italic;
          color: #5a4f3a;
        }

        .dark .sub {
          font-family: var(--font-space-grotesk), 'Space Grotesk', sans-serif;
          font-weight: 400;
          font-size: 14px;
          line-height: 1.6;
          color: #b9b1a2;
        }

        .enter {
          margin-top: 30px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-space-grotesk), 'Space Grotesk', sans-serif;
          font-weight: 500;
          font-size: 13px;
          line-height: 1;
          letter-spacing: .18em;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity .45s, transform .45s;
        }

        .dark .enter {
          justify-content: flex-end;
        }

        .enter .arrow {
          transition: transform .4s;
        }

        .light.active .title {
          letter-spacing: .005em;
        }

        .light.active .enter {
          opacity: 1;
          transform: none;
        }

        .dark.active .enter {
          opacity: 1;
          transform: none;
        }

        .panel.active .enter .arrow {
          transform: translateX(6px);
        }

        .panel.dim .sub {
          opacity: .28;
        }

        .panel.dim .title {
          opacity: .78;
        }

        .seed {
          position: absolute;
          bottom: 7vh;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-space-grotesk), 'Space Grotesk', sans-serif;
          font-weight: 500;
          font-size: 11px;
          line-height: 1;
          letter-spacing: .16em;
          text-transform: uppercase;
          opacity: .5;
          transition: opacity .4s;
        }

        .seed .bead {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .light .seed {
          left: 6vw;
          color: #6f6147;
        }

        .light .seed .bead {
          background: radial-gradient(circle at 32% 28%, #3a352c, #0c0b0a);
        }

        .dark .seed {
          right: 6vw;
          flex-direction: row-reverse;
          color: #a89a7e;
        }

        .dark .seed .bead {
          background: radial-gradient(circle at 32% 28%, #fff8e6, #cdbf9a);
        }

        .panel.active .seed {
          opacity: .85;
        }

        /* Dual-World Masked Pendant Styling */
        .pendant-container {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 34vmin;
          height: 34vmin;
          transform: translate(-50%, -50%);
          transform-style: preserve-3d;
          pointer-events: none;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform;
        }

        .pendant-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
          will-change: filter;
        }

        /* Statement (Light side) Gold look: warm, soft, classy */
        .statement-pendant .pendant-img {
          filter: sepia(0.25) brightness(1.02) contrast(0.95) drop-shadow(0 15px 30px rgba(122, 106, 74, 0.28));
        }

        /* Streetwear (Dark side) Gold look: bold, high metallic contrast, deep shadow */
        .streetwear-pendant .pendant-img {
          filter: contrast(1.25) saturate(1.1) brightness(1.08) drop-shadow(0 20px 35px rgba(0, 0, 0, 0.7));
        }

        #halo {
          position: absolute;
          z-index: 3;
          top: 50%;
          left: 50%;
          width: 46vmin;
          height: 46vmin;
          transform: translate(-50%, -50%);
          pointer-events: none;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,166,78,.30), rgba(201,166,78,0) 62%);
          filter: blur(6px);
          transition: opacity .6s;
          opacity: .9;
        }

        #seamline {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }

        #seamline path {
          fill: none;
          stroke: url(#seamGrad);
          stroke-width: 1.4;
          opacity: .7;
          filter: drop-shadow(0 0 6px rgba(201,166,78,.5));
        }

        .caption {
          position: absolute;
          left: 50%;
          bottom: 4.2vh;
          transform: translateX(-50%);
          z-index: 5;
          font-family: var(--font-space-grotesk), 'Space Grotesk', sans-serif;
          font-weight: 500;
          font-size: 11px;
          line-height: 1;
          letter-spacing: .32em;
          text-transform: uppercase;
          color: var(--gold);
          opacity: .55;
          pointer-events: none;
          transition: opacity .4s;
          white-space: nowrap;
        }

        #stage.touched .caption {
          opacity: 0;
        }

        #wipe {
          position: absolute;
          inset: 0;
          z-index: 9;
          pointer-events: none;
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.5s ease-in-out;
        }

        #wipe .word {
          font-family: var(--font-fraunces), 'Fraunces', serif;
          font-weight: 300;
          font-size: clamp(40px, 10vw, 120px);
          line-height: 1;
          font-style: italic;
          color: var(--gold-soft);
        }

         @media (max-width: 820px) {
           .light {
             padding: 0 7vw;
             justify-content: flex-start;
             padding-top: 8vh;
           }
           .dark {
             padding: 0 7vw;
             align-items: flex-start;
             text-align: left;
             justify-content: flex-end;
             padding-bottom: 8vh;
           }
           .light .sub, .dark .sub {
             max-width: 24ch;
             font-size: 13px;
           }
           .seed {
             display: none;
           }
           .pendant-container {
             width: 48vw;
             height: 48vw;
             max-width: 190px;
             max-height: 190px;
           }
         }
      ` }} />

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="seam" clipPathUnits="userSpaceOnUse">
            <path id="seamPath" ref={seamPathRef} d="" />
          </clipPath>
          <linearGradient id="seamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c9a64e" stopOpacity="0" />
            <stop offset="0.5" stopColor="#e7cf8f" />
            <stop offset="1" stopColor="#c9a64e" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div id="stage" ref={stageRef}>
        {/* Statement Side (Light Panel) */}
        <section className="panel light" id="lp" ref={lpRef} onClick={(e) => handlePanelClick(e, 'Statement', 'L')}>
          <div className="kicker">The Vault</div>
          <h1 className="title">Statement</h1>
          <p className="sub">Heirloom weight. Quiet authority. Pieces that speak once, and are remembered.</p>
          <a className="enter">
            Enter the floor <span className="arrow">&rarr;</span>
          </a>
          <div className="seed">
            <span className="bead"></span>streetwear lives here too
          </div>

          {/* Centered Statement Pendant Image */}
          <div className="pendant-container statement-pendant" ref={lpPendantRef}>
            <img src="/pngs/p1.png" className="pendant-img" alt="Statement Pendant" />
          </div>
        </section>

        {/* Streetwear Side (Dark Panel) */}
        <section className="panel dark" id="dp" ref={dpRef} onClick={(e) => handlePanelClick(e, 'Streetwear', 'R')}>
          <div className="kicker">The Vault</div>
          <h1 className="title">Streetwear</h1>
          <p className="sub">Loud metal, worn daily. Gold that moves with you and isn&rsquo;t precious about it.</p>
          <a className="enter">
            Enter the street <span className="arrow">&rarr;</span>
          </a>
          <div className="seed">
            <span className="bead"></span>statement lives here too
          </div>

          {/* Centered Streetwear Pendant Image (Clipped automatically by the parent panel's clip-path) */}
          <div className="pendant-container streetwear-pendant" ref={dpPendantRef}>
            <img src="/pngs/p3.png" className="pendant-img" alt="Streetwear Pendant" />
          </div>
        </section>

        {/* Dynamic Seam Line and Glow */}
        <svg id="seamline">
          <path id="seamLineP" ref={seamLinePRef} d="" />
        </svg>

        {/* Visual Glow Aura behind the pendant */}
        <div id="halo"></div>

        {/* Centered Instructions helper */}
        <div className="caption">choose your side</div>

        {/* Screen wipe overlay for navigation transition */}
        <div id="wipe" ref={wipeRef}>
          <span className="word" ref={wipeWordRef}></span>
        </div>
      </div>
    </div>
  );
}
