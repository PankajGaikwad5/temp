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
    wipeRef.current.style.backgroundColor = name === 'Statement' ? '#ece6d8' : '#0c0b0a';
    wipeWordRef.current.style.color = name === 'Statement' ? '#1c1813' : '#e7cf8f';
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
    <div className={`bg-[#0c0b0a] h-screen w-screen overflow-hidden relative ${fraunces.variable} ${spaceGrotesk.variable}`}>
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

      <div id="stage" ref={stageRef} className="fixed inset-0 cursor-pointer select-none [perspective:1000px] group/stage">
        {/* Statement Side (Light Panel) */}
        <section
          className="group panel absolute inset-0 flex flex-col justify-center will-change-[clip-path] z-[1] bg-[#ece6d8] text-[#1c1813] pl-[6vw] max-[820px]:px-[7vw] max-[820px]:justify-start max-[820px]:pt-[8vh]"
          id="lp"
          ref={lpRef}
          onClick={(e) => handlePanelClick(e, 'Statement', 'L')}
        >
          <div className="font-[var(--font-space-grotesk)] font-medium text-[12px] leading-none tracking-[0.42em] uppercase opacity-[0.55] mb-[18px] text-[#7a6a4a]">
            The Vault
          </div>
          <h1 className="title font-[var(--font-fraunces)] font-light text-[clamp(44px,9vw,128px)] leading-[0.92] tracking-[-0.01em] italic transition-[transform,letter-spacing,opacity] duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-[.active]:tracking-[0.005em] group-[.dim]:opacity-[0.78]">
            Statement
          </h1>
          <p className="sub mt-[20px] max-w-[30ch] opacity-70 transition-[opacity,transform] duration-500 font-[var(--font-fraunces)] font-normal text-[16px] leading-[1.5] italic text-[#5a4f3a] group-[.dim]:opacity-[0.28] max-[820px]:max-w-[24ch] max-[820px]:text-[13px]">
            Heirloom weight. Quiet authority. Pieces that speak once, and are remembered.
          </p>
          <a className="enter mt-[30px] inline-flex items-center gap-[10px] font-[var(--font-space-grotesk)] font-medium text-[13px] leading-none tracking-[0.18em] uppercase opacity-0 translate-y-[8px] transition-[opacity,transform] duration-[450ms] group-[.active]:opacity-100 group-[.active]:translate-y-0">
            Enter the floor <span className="arrow transition-transform duration-400 group-[.active]:translate-x-[6px]">&rarr;</span>
          </a>
          <div className="seed absolute bottom-[7vh] flex items-center gap-[10px] font-[var(--font-space-grotesk)] font-medium text-[11px] leading-none tracking-[0.16em] uppercase opacity-50 transition-opacity duration-400 group-[.active]:opacity-[0.85] left-[6vw] text-[#6f6147] max-[820px]:hidden">
            <span className="bead w-[30px] h-[30px] rounded-full bg-[radial-gradient(circle_at_32%_28%,#3a352c,#0c0b0a)]"></span>
            streetwear lives here too
          </div>

          {/* Centered Statement Pendant Image */}
          <div className="pendant-container absolute top-1/2 left-1/2 w-[34vmin] h-[34vmin] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] pointer-events-none z-[4] flex items-center justify-center will-change-transform max-[820px]:w-[48vw] max-[820px]:h-[48vw] max-[820px]:max-w-[190px] max-[820px]:max-h-[190px]" ref={lpPendantRef}>
            <img
              src="/pngs/p1.png"
              className="w-full h-full object-contain block select-none [-webkit-user-drag:none] will-change-[filter] filter-[sepia(0.25)_brightness(1.02)_contrast(0.95)_drop-shadow(0_15px_30px_rgba(122,106,74,0.28))]"
              alt="Statement Pendant"
            />
          </div>
        </section>

        {/* Streetwear Side (Dark Panel) */}
        <section
          className="group panel absolute inset-0 flex flex-col justify-center will-change-[clip-path] z-[2] bg-[#0c0b0a] text-[#f2ede1] items-end pr-[6vw] text-right [clip-path:url(#seam)] max-[820px]:px-[7vw] max-[820px]:items-start max-[820px]:text-left max-[820px]:justify-end max-[820px]:pb-[8vh]"
          id="dp"
          ref={dpRef}
          onClick={(e) => handlePanelClick(e, 'Streetwear', 'R')}
        >
          <div className="font-[var(--font-space-grotesk)] font-medium text-[12px] leading-none tracking-[0.42em] uppercase opacity-[0.55] mb-[18px] text-[#c9a64e]">
            The Vault
          </div>
          <h1 className="title font-[var(--font-space-grotesk)] font-bold text-[clamp(40px,8.4vw,116px)] leading-[0.9] tracking-[-0.03em] uppercase transition-[transform,letter-spacing,opacity] duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-[.dim]:opacity-[0.78]">
            Streetwear
          </h1>
          <p className="sub mt-[20px] max-w-[30ch] opacity-70 transition-[opacity,transform] duration-500 font-[var(--font-space-grotesk)] font-normal text-[14px] leading-[1.6] text-[#b9b1a2] group-[.dim]:opacity-[0.28] max-[820px]:max-w-[24ch] max-[820px]:text-[13px]">
            Loud metal, worn daily. Gold that moves with you and isn&rsquo;t precious about it.
          </p>
          <a className="enter mt-[30px] inline-flex items-center gap-[10px] font-[var(--font-space-grotesk)] font-medium text-[13px] leading-none tracking-[0.18em] uppercase opacity-0 translate-y-[8px] transition-[opacity,transform] duration-[450ms] group-[.active]:opacity-100 group-[.active]:translate-y-0 justify-end">
            Enter the street <span className="arrow transition-transform duration-400 group-[.active]:translate-x-[6px]">&rarr;</span>
          </a>
          <div className="seed absolute bottom-[7vh] flex items-center gap-[10px] font-[var(--font-space-grotesk)] font-medium text-[11px] leading-none tracking-[0.16em] uppercase opacity-50 transition-opacity duration-400 group-[.active]:opacity-[0.85] right-[6vw] flex-row-reverse text-[#a89a7e] max-[820px]:hidden">
            <span className="bead w-[30px] h-[30px] rounded-full bg-[radial-gradient(circle_at_32%_28%,#fff8e6,#cdbf9a)]"></span>
            statement lives here too
          </div>

          {/* Centered Streetwear Pendant Image (Clipped automatically by the parent panel's clip-path) */}
          <div className="pendant-container absolute top-1/2 left-1/2 w-[34vmin] h-[34vmin] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] pointer-events-none z-[4] flex items-center justify-center will-change-transform max-[820px]:w-[48vw] max-[820px]:h-[48vw] max-[820px]:max-w-[190px] max-[820px]:max-h-[190px]" ref={dpPendantRef}>
            <img
              src="/pngs/p3.png"
              className="w-full h-full object-contain block select-none [-webkit-user-drag:none] will-change-[filter] filter-[contrast(1.25)_saturate(1.1)_brightness(1.08)_drop-shadow(0_20px_35px_rgba(0,0,0,0.7))]"
              alt="Streetwear Pendant"
            />
          </div>
        </section>

        {/* Dynamic Seam Line and Glow */}
        <svg id="seamline" className="absolute inset-0 z-[3] pointer-events-none">
          <path id="seamLineP" ref={seamLinePRef} className="fill-none [stroke:url(#seamGrad)] stroke-[1.4] opacity-70 filter-[drop-shadow(0_0_6px_rgba(201,166,78,0.5))]" d="" />
        </svg>

        {/* Visual Glow Aura behind the pendant */}
        <div id="halo" className="absolute z-[3] top-1/2 left-1/2 w-[46vmin] h-[46vmin] -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full bg-[radial-gradient(circle,rgba(201,166,78,0.3),rgba(201,166,78,0)_62%)] blur-[6px] transition-opacity duration-600 opacity-90"></div>

        {/* Centered Instructions helper */}
        <div className="caption absolute left-1/2 bottom-[4.2vh] -translate-x-1/2 z-[5] font-[var(--font-space-grotesk)] font-medium text-[11px] leading-none tracking-[0.32em] uppercase text-[#c9a64e] opacity-55 pointer-events-none transition-opacity duration-400 whitespace-nowrap group-[.touched]/stage:opacity-0">choose your side</div>

        {/* Screen wipe overlay for navigation transition */}
        <div id="wipe" ref={wipeRef} className="absolute inset-0 z-[9] pointer-events-none opacity-0 flex items-center justify-center transition-opacity duration-500 ease-in-out">
          <span className="word font-[var(--font-fraunces)] font-light text-[clamp(40px,10vw,120px)] leading-none italic text-[#e7cf8f]" ref={wipeWordRef}></span>
        </div>
      </div>
    </div>
  );
}
