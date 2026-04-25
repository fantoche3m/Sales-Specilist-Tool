import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  ✏️  EDITE AS URLs AQUI quando tiver os deploys prontos
// ─────────────────────────────────────────────────────────────────────────────
const TOOL_URLS = {
  wincc:   "https://win-cc-unified-configurator-2-0.vercel.app/",   // ← substitua pela URL do WinCC Configurator
  plc:     "https://plc-license-configurator.vercel.app/",                                   // Em breve
  network: null,                                   // Em breve
  pptx:    null,                                   // Em breve
};
// ─────────────────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    key: "wincc",
    icon: "⚙",
    tag: "LICENCIAMENTO",
    title: "WinCC Unified V21",
    subtitle: "Configurador de Licenças",
    desc: "Especifique licenças de Engenharia e Runtime para projetos WinCC Unified V21 com exportação automática de MLFBs em Excel.",
    features: ["Engineering + Runtime", "Arquitetura Redundante", "Exportação XLSX", "Opcionais por servidor"],
    accent: "#009999",
    soon: false,
  },
  {
    key: "plc",
    icon: "◈",
    tag: "LICENCIAMENTO",
    title: "SIMATIC S7",
    subtitle: "Configurador de Licenças PLC",
    desc: "Configure licenças para CLPs das famílias S7-1200 e S7-1500, TIA Portal e módulos de expansão com precisão.",
    features: ["S7-1200 / S7-1500", "TIA Portal ES", "Motion Control", "Safety F-CPU"],
    accent: "#1a6fad",
    soon: false,
  },
  {
    key: "network",
    icon: "⬡",
    tag: "ENGENHARIA",
    title: "Network Architect",
    subtitle: "Montador de Diagramas de Rede",
    desc: "Monte arquiteturas de rede industriais com componentes Siemens reais e exporte diagramas técnicos em PDF estilo CAD.",
    features: ["PROFINET / Modbus / EtherNet/IP", "Web Server (HTTP/HTTPS)", "Estilo CAD técnico", "Exportação PDF"],
    accent: "#00aa66",
    soon: true,
  },
  {
    key: "pptx",
    icon: "✦",
    tag: "INTELIGÊNCIA ARTIFICIAL",
    title: "AI Translator",
    subtitle: "Tradutor de Apresentações com IA",
    desc: "LLM com vocabulário técnico de automação Siemens — traduz apresentações PowerPoint sem erros de terminologia e sem quebrar o layout.",
    features: ["LLM com glossário Siemens", "Preserva layout PPTX", "PT / EN / ES / DE", "PROFINET, HMI, SCADA, PLC..."],
    accent: "#8b5cf6",
    soon: true,
  },
];

// ── SIEMENS LOGO ──────────────────────────────────────────────────────────────
function SiemensLogo({ height = 18, color = "#009999" }) {
  return (
    <svg height={height} viewBox="0 0 148 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text
        y="20"
        fontFamily="'Rajdhani', sans-serif"
        fontWeight="700"
        fontSize="24"
        fill={color}
        letterSpacing="3"
      >SIEMENS</text>
    </svg>
  );
}

// ── ANIMATED PARTICLE BACKGROUND ─────────────────────────────────────────────
function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const dots = Array.from({ length: 55 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00022,
      vy: (Math.random() - 0.5) * 0.00022,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = 1; if (d.x > 1) d.x = 0;
        if (d.y < 0) d.y = 1; if (d.y > 1) d.y = 0;
      });

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = (dots[i].x - dots[j].x) * W;
          const dy = (dots[i].y - dots[j].y) * H;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,153,153,${(1 - dist / 150) * 0.13})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(dots[i].x * W, dots[i].y * H);
            ctx.lineTo(dots[j].x * W, dots[j].y * H);
            ctx.stroke();
          }
        }
      }

      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x * W, d.y * H, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,153,153,0.28)";
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

// ── TOOL CARD ────────────────────────────────────────────────────────────────
function ToolCard({ tool, index }) {
  const [hovered, setHovered] = useState(false);
  const url = TOOL_URLS[tool.key];
  const clickable = !tool.soon && url;

  return (
    <div
      onClick={() => { if (clickable) window.open(url, "_blank"); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered && clickable ? "#141719" : "#0f1113",
        border: `1px solid ${hovered && clickable ? tool.accent + "55" : "#1e2326"}`,
        borderRadius: 16,
        padding: "30px 26px",
        cursor: clickable ? "pointer" : "default",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered && clickable ? "translateY(-6px)" : "none",
        boxShadow: hovered && clickable
          ? `0 20px 60px ${tool.accent}15, 0 4px 20px rgba(0,0,0,0.4)`
          : "0 2px 12px rgba(0,0,0,0.3)",
        opacity: tool.soon ? 0.72 : 1,
        animation: `cardIn 0.5s ease ${index * 0.1}s both`,
        overflow: "hidden",
      }}
    >
      {/* Accent top line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${tool.accent}, transparent)`,
        opacity: hovered && clickable ? 1 : tool.soon ? 0.25 : 0,
        transition: "opacity 0.3s",
      }} />

      {/* Corner glow */}
      <div style={{
        position: "absolute", top: -50, right: -50, width: 180, height: 180,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${tool.accent}10 0%, transparent 70%)`,
        opacity: hovered ? 1 : 0.3,
        transition: "opacity 0.4s",
        pointerEvents: "none",
      }} />

      {/* Em breve badge */}
      {tool.soon && (
        <div style={{
          position: "absolute", top: 18, right: 18,
          background: `${tool.accent}18`, border: `1px solid ${tool.accent}44`,
          color: tool.accent, fontSize: 9, fontWeight: 700,
          padding: "3px 10px", borderRadius: 20,
          letterSpacing: "0.1em", fontFamily: "'Rajdhani', sans-serif",
        }}>Em breve</div>
      )}

      {/* Tag */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 18 }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: tool.accent, boxShadow: `0 0 5px ${tool.accent}` }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: tool.accent, letterSpacing: "0.12em", fontFamily: "'Rajdhani', sans-serif" }}>
          {tool.tag}
        </span>
      </div>

      {/* Icon */}
      <div style={{
        fontSize: 34, marginBottom: 14, color: tool.accent,
        filter: `drop-shadow(0 0 8px ${tool.accent}50)`,
        lineHeight: 1,
        transition: "transform 0.3s",
        transform: hovered && clickable ? "scale(1.12)" : "scale(1)",
      }}>{tool.icon}</div>

      {/* Title */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 21, fontWeight: 700, color: "#f0f2f4", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
          {tool.title}
        </div>
        <div style={{ fontSize: 12, fontWeight: 500, color: tool.accent, marginTop: 3, fontFamily: "'Rajdhani', sans-serif" }}>
          {tool.subtitle}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#1a1d20", margin: "14px 0" }} />

      {/* Description */}
      <p style={{ fontSize: 13, color: "#6b7a85", lineHeight: 1.65, marginBottom: 18, fontFamily: "'DM Sans', sans-serif" }}>
        {tool.desc}
      </p>

      {/* Features */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {tool.features.map(f => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: tool.accent, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#6b7a85", fontFamily: "'DM Sans', sans-serif" }}>{f}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      {clickable && (
        <div style={{
          marginTop: 22, display: "flex", alignItems: "center", gap: 6,
          color: hovered ? tool.accent : "#334455",
          fontSize: 12, fontWeight: 700,
          fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em",
          transition: "color 0.2s",
        }}>
          ACESSAR FERRAMENTA
          <span style={{
            transition: "transform 0.2s",
            transform: hovered ? "translateX(4px)" : "none",
            display: "inline-block",
          }}>→</span>
        </div>
      )}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#080a0b", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #1e2326; border-radius: 3px; }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse   { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }
        @keyframes scanline { 0%{ transform:translateY(-100%); } 100%{ transform:translateY(100vh); } }
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        @media (max-width: 600px) {
          .hero-title { font-size: 42px !important; }
          .hero-tagline { font-size: 16px !important; }
          .nav-name { display: none; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 5%",
        background: scrolled ? "rgba(8,10,11,0.93)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid #141719" : "none",
        transition: "all 0.3s",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "linear-gradient(135deg, #009999, #005f5f)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 900, color: "#fff",
            fontFamily: "'Rajdhani', sans-serif",
            boxShadow: "0 0 18px rgba(0,153,153,0.35)",
            flexShrink: 0,
          }}>SST</div>
          <span className="nav-name" style={{ fontSize: 15, fontWeight: 700, color: "#f0f2f4", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>
            Sales Specialist Tool
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <SiemensLogo height={16} color="#2a3f3f" />
          <div style={{ width: 1, height: 16, background: "#1e2326" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#009999", boxShadow: "0 0 7px #009999", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 10, color: "#334455", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.07em" }}>LATIN AMERICA</span>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "120px 5% 80px",
        overflow: "hidden",
      }}>
        <ParticleBackground />

        {/* Radial glow */}
        <div style={{
          position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)",
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,153,153,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        {/* Scanline */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", opacity: 0.025 }}>
          <div style={{ width: "100%", height: 2, background: "#009999", animation: "scanline 10s linear infinite" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 880 }}>

          {/* Siemens logo pill */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28, animation: "fadeIn 0.6s ease 0.1s both" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              padding: "8px 20px",
              border: "1px solid #1a2a2a", borderRadius: 8,
              background: "rgba(0,153,153,0.04)",
            }}>
              <SiemensLogo height={20} color="#009999" />
              <div style={{ width: 1, height: 18, background: "#1a2a2a" }} />
              <span style={{ fontSize: 10, color: "#2a4040", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.12em" }}>
                DIGITAL INDUSTRIES
              </span>
            </div>
          </div>

          {/* Main title — horizontal */}
          <h1
            className="hero-title"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(40px, 7.5vw, 84px)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              marginBottom: 16,
              animation: "heroIn 0.7s ease 0.25s both",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "baseline",
              gap: "0.22em",
            }}
          >
            <span style={{ color: "#f0f2f4" }}>Sales</span>
            <span style={{ color: "#f0f2f4" }}>Specialist</span>
            <span style={{
              background: "linear-gradient(90deg, #009999, #00dddd, #009999)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 4s linear infinite",
            }}>Tool</span>
          </h1>

          {/* SST pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,153,153,0.1)", border: "1px solid rgba(0,153,153,0.3)",
            borderRadius: 24, padding: "5px 16px", marginBottom: 32,
            animation: "heroIn 0.7s ease 0.35s both",
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#009999", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, color: "#009999", fontWeight: 700, letterSpacing: "0.14em", fontFamily: "'Rajdhani', sans-serif" }}>SST</span>
          </div>

          {/* Tagline */}
          <p
            className="hero-tagline"
            style={{
              fontSize: "clamp(16px, 2.2vw, 21px)",
              color: "#4a5a65",
              lineHeight: 1.65,
              maxWidth: 580,
              margin: "0 auto 52px",
              fontWeight: 300,
              animation: "heroIn 0.7s ease 0.45s both",
            }}
          >
            Automatize o operacional para focar no estratégico.{" "}
            <span style={{ color: "#2a3d3d" }}>
              Ferramentas criadas para equipes de vendas técnicas Siemens.
            </span>
          </p>

          {/* Stats */}
          <div style={{
            display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap",
            animation: "heroIn 0.7s ease 0.55s both",
          }}>
            {[
              { n: "4",  label: "Ferramentas" },
              { n: "0",  label: "Fricção operacional" },
              { n: "∞",  label: "Produtividade" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 34, fontWeight: 700, color: "#009999", fontFamily: "'Rajdhani', sans-serif", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 11, color: "#2a3d3d", marginTop: 5, letterSpacing: "0.07em", fontFamily: "'Rajdhani', sans-serif" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          animation: "fadeIn 1s ease 1.2s both",
        }}>
          <span style={{ fontSize: 9, color: "#1a2e2e", letterSpacing: "0.14em", fontFamily: "'Rajdhani', sans-serif" }}>EXPLORAR</span>
          <div style={{ width: 1, height: 28, background: "linear-gradient(to bottom, #1a2e2e, transparent)" }} />
        </div>
      </section>

      {/* ── TOOLS SECTION ── */}
      <section style={{ padding: "72px 5% 110px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 56, textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#009999", letterSpacing: "0.16em", fontFamily: "'Rajdhani', sans-serif", marginBottom: 12 }}>
            PLATAFORMA DE PRODUTIVIDADE
          </div>
          <h2 style={{
            fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700,
            color: "#f0f2f4", fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: "-0.02em", lineHeight: 1.25,
          }}>
            Todas as ferramentas que você<br />
            <span style={{ color: "#009999" }}>precisa em um só lugar</span>
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 270px), 1fr))",
          gap: 18,
        }}>
          {TOOLS.map((tool, i) => <ToolCard key={tool.key} tool={tool} index={i} />)}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid #0d1011",
        padding: "28px 5%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "linear-gradient(135deg, #009999, #005f5f)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 900, color: "#fff", fontFamily: "'Rajdhani', sans-serif",
          }}>SST</div>
          <div style={{ width: 1, height: 16, background: "#1a1d20" }} />
          <SiemensLogo height={13} color="#1a2e2e" />
        </div>
        <span style={{ fontSize: 10, color: "#1a2a2a", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}>
          Latin America · {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}
