"use client";

import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** Плавный счётчик от 0 до target (запускается при монтировании). */
export function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    let raf = 0;
    let startTs = 0;
    const from = ref.current;
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const t = Math.min(1, (ts - startTs) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;
      ref.current = next;
      setVal(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Гарантия финального значения, даже если rAF тормозится (фон. вкладка).
    const safety = setTimeout(() => {
      ref.current = target;
      setVal(target);
    }, duration + 250);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    };
  }, [target, duration]);
  return val;
}

/** Запуск анимации после монтирования (для плавного «появления» графиков). */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setM(true), 30);
    return () => clearTimeout(t);
  }, []);
  return m;
}

function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export function Sparkline({
  data,
  color,
  className,
}: {
  data: number[];
  color: string;
  className?: string;
}) {
  const id = useId();
  const w = 100;
  const h = 32;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const pts = data.map(
    (v, i) =>
      [(i / (data.length - 1)) * w, h - 2 - ((v - min) / span) * (h - 6)] as [
        number,
        number,
      ]
  );
  const line = smoothPath(pts);
  const area = `${line} L ${w},${h} L 0,${h} Z`;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Series = { m: string; imp: number; exp: number };

/** Большой график динамики: две сглаженные области + сетка + ховер-тултип. */
export function AreaChart({ data }: { data: Series[] }) {
  const impId = useId();
  const expId = useId();
  const mounted = useMounted();
  const [hi, setHi] = useState<number | null>(null);

  const W = 640;
  const H = 260;
  const pad = { l: 34, r: 14, t: 18, b: 30 };
  const n = data.length;
  const max = Math.ceil(Math.max(...data.map((d) => Math.max(d.imp, d.exp))) + 1);
  const x = (i: number) => pad.l + (i / (n - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);

  const impPts = data.map((d, i) => [x(i), y(d.imp)] as [number, number]);
  const expPts = data.map((d, i) => [x(i), y(d.exp)] as [number, number]);
  const impLine = smoothPath(impPts);
  const expLine = smoothPath(expPts);
  const base = H - pad.b;
  const impArea = `${impLine} L ${x(n - 1)},${base} L ${x(0)},${base} Z`;
  const expArea = `${expLine} L ${x(n - 1)},${base} L ${x(0)},${base} Z`;
  const ticks = [0, max / 2, max];

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((mx - pad.l) / (W - pad.l - pad.r)) * (n - 1));
    setHi(Math.max(0, Math.min(n - 1, i)));
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: "auto" }}
        onMouseMove={onMove}
        onMouseLeave={() => setHi(null)}
      >
        <defs>
          <linearGradient id={expId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={impId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c5cfc" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#7c5cfc" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={pad.l}
              x2={W - pad.r}
              y1={y(t)}
              y2={y(t)}
              className="stroke-border"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <text
              x={pad.l - 8}
              y={y(t) + 3}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize="10"
            >
              {t}
            </text>
          </g>
        ))}

        {/* области */}
        <path
          d={expArea}
          fill={`url(#${expId})`}
          className={cn(
            "transition-opacity duration-700",
            mounted ? "opacity-100" : "opacity-0"
          )}
        />
        <path
          d={impArea}
          fill={`url(#${impId})`}
          className={cn(
            "transition-opacity duration-700",
            mounted ? "opacity-100" : "opacity-0"
          )}
        />
        {/* линии с анимацией прорисовки */}
        <path
          d={expLine}
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: mounted ? 0 : 1,
            transition: "stroke-dashoffset 1.1s ease",
          }}
        />
        <path
          d={impLine}
          fill="none"
          stroke="#7c5cfc"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: mounted ? 0 : 1,
            transition: "stroke-dashoffset 1.1s ease 0.1s",
          }}
        />

        {/* ховер */}
        {hi !== null && (
          <g>
            <line
              x1={x(hi)}
              x2={x(hi)}
              y1={pad.t}
              y2={base}
              className="stroke-border"
              strokeWidth="1"
            />
            <circle cx={x(hi)} cy={y(data[hi].exp)} r="4" fill="#10b981" stroke="white" strokeWidth="2" />
            <circle cx={x(hi)} cy={y(data[hi].imp)} r="4" fill="#7c5cfc" stroke="white" strokeWidth="2" />
          </g>
        )}

        {data.map((d, i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize="10"
          >
            {d.m}
          </text>
        ))}
      </svg>

      {hi !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 -translate-x-1/2 rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg"
          style={{ left: `${(x(hi) / W) * 100}%` }}
        >
          <div className="mb-1 font-semibold text-foreground">{data[hi].m}</div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: "#7c5cfc" }} />
            Импорт
            <span className="ml-auto font-semibold text-foreground">
              ${data[hi].imp.toFixed(1)} млрд
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: "#10b981" }} />
            Экспорт
            <span className="ml-auto font-semibold text-foreground">
              ${data[hi].exp.toFixed(1)} млрд
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Стопочные столбцы импорт/экспорт по месяцам с анимацией роста. */
export function StackedBars({ data }: { data: Series[] }) {
  const mounted = useMounted();
  const W = 640;
  const H = 240;
  const pad = { l: 30, r: 12, t: 16, b: 28 };
  const n = data.length;
  const max = Math.ceil(Math.max(...data.map((d) => d.imp + d.exp)) + 1);
  const plotH = H - pad.t - pad.b;
  const base = H - pad.b;
  const slot = (W - pad.l - pad.r) / n;
  const bw = Math.min(20, slot * 0.5);
  const h = (v: number) => (v / max) * plotH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "auto" }}>
      {[0, max / 2, max].map((t, i) => (
        <g key={i}>
          <line
            x1={pad.l}
            x2={W - pad.r}
            y1={base - h(t)}
            y2={base - h(t)}
            className="stroke-border"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
          <text
            x={pad.l - 6}
            y={base - h(t) + 3}
            textAnchor="end"
            className="fill-muted-foreground"
            fontSize="10"
          >
            {t}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const cx = pad.l + slot * i + slot / 2;
        const impH = mounted ? h(d.imp) : 0;
        const expH = mounted ? h(d.exp) : 0;
        return (
          <g key={i}>
            {/* импорт (низ) */}
            <rect
              x={cx - bw / 2}
              width={bw}
              y={base - impH}
              height={impH}
              rx="4"
              fill="#7c5cfc"
              style={{ transition: `y .8s ease ${i * 0.04}s, height .8s ease ${i * 0.04}s` }}
            />
            {/* экспорт (верх) */}
            <rect
              x={cx - bw / 2}
              width={bw}
              y={base - impH - expH}
              height={expH}
              rx="4"
              fill="#10b981"
              style={{ transition: `y .8s ease ${i * 0.04}s, height .8s ease ${i * 0.04}s` }}
            />
            <text
              x={cx}
              y={H - 8}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize="10"
            >
              {d.m}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Кольцевая диаграмма с анимацией заполнения. */
export function Donut({
  segments,
  centerTop,
  centerSub,
}: {
  segments: { label: string; value: number; color: string }[];
  centerTop: string;
  centerSub: string;
}) {
  const mounted = useMounted();
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = 56;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="relative mx-auto h-44 w-44">
      <svg viewBox="0 0 140 140" className="h-44 w-44 -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" className="stroke-muted" strokeWidth="16" />
        {segments.map((s, i) => {
          const frac = s.value / total;
          const len = mounted ? frac * C : 0;
          const off = -(acc / total) * C;
          acc += s.value;
          return (
            <circle
              key={i}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={off}
              style={{ transition: `stroke-dasharray .9s ease ${i * 0.08}s` }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          {centerTop}
        </span>
        <span className="text-xs text-muted-foreground">{centerSub}</span>
      </div>
    </div>
  );
}
