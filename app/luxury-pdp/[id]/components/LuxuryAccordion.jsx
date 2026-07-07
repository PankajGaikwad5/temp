'use client';

export default function LuxuryAccordion({ sections, openSection, setOpenSection }) {
  return (
    <div>
      {sections.map(({ id, label, content, specs }) => {
        const isOpen = openSection === id;
        return (
          <div key={id} style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <button
              onClick={() => setOpenSection(isOpen ? null : id)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '16px 0',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1a' }}>
                {label}
              </span>
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 200,
                color: 'rgba(0,0,0,0.3)', lineHeight: 1,
                display: 'inline-block',
                transform: isOpen ? 'rotate(45deg)' : 'none',
                transition: 'transform 0.25s',
              }}>
                +
              </span>
            </button>

            <div style={{
              maxHeight: isOpen ? '800px' : 0,
              overflow: 'hidden',
              opacity: isOpen ? 1 : 0,
              transition: 'max-height 0.4s ease, opacity 0.3s ease',
            }}>
              <div style={{ paddingBottom: 20 }}>
                {specs ? (
                  <div>
                    {specs.map((spec) => (
                      <div key={spec.label} style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'baseline', padding: '10px 0',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                      }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.38)' }}>
                          {spec.label}
                        </span>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', fontWeight: 300, color: 'rgba(0,0,0,0.65)' }}>
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {content.split('\n\n').map((block, i) => {
                      const isHeader = block.length < 40 && !block.includes('.');
                      return isHeader ? (
                        <p key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1a1a1a', marginTop: i === 0 ? 0 : 20, marginBottom: 8 }}>
                          {block}
                        </p>
                      ) : (
                        <p key={i} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', lineHeight: 1.85, fontWeight: 300, color: '#666', marginBottom: 12 }}>
                          {block.split('\n').map((line, j) => (
                            <span key={j}>{line}{j < block.split('\n').length - 1 && <br />}</span>
                          ))}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }} />
    </div>
  );
}
