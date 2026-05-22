import { useRef, useState, useCallback } from "react";

interface Props {
  src: string;
  facebookUrl?: string;
}

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
};

export default function VideoPlayer({ src, facebookUrl }: Props) {
  const ref                       = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying]     = useState(false);
  const [time,    setTime]        = useState(0);
  const [dur,     setDur]         = useState(0);
  const [muted,   setMuted]       = useState(false);

  const toggle = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else          { v.pause(); setPlaying(false); }
  }, []);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const v = ref.current;
    if (!v || !dur) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - r.left) / r.width) * dur;
  }, [dur]);

  const skip = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const v = ref.current;
    if (!v) return;
    v.currentTime = Math.min(v.currentTime + 10, dur);
  }, [dur]);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const pct = dur > 0 ? (time / dur) * 100 : 0;

  return (
    <div
      onClick={toggle}
      className="group relative w-full aspect-video rounded-[15px] overflow-hidden bg-[rgb(30,30,30)] shadow-[inset_0px_0px_1px_black] hover:shadow-[inset_0px_10px_36px_-13px_rgba(0,0,0,0.75)] transition-shadow duration-200 cursor-pointer select-none"
    >
      {/* ── Vidéo ── */}
      <video
        ref={ref}
        src={src}
        className="absolute inset-0 w-full h-full object-contain bg-black"
        onTimeUpdate={() => setTime(ref.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDur(ref.current?.duration ?? 0)}
        onEnded={() => setPlaying(false)}
        playsInline
      />

      {/* ── Dégradé overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55 pointer-events-none" />

      {/* ── Gros bouton Play centré (quand en pause, disparaît au hover) ── */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-200 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg viewBox="0 0 16 16" className="w-8 h-8 fill-white ml-1">
              <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
            </svg>
          </div>
        </div>
      )}

      {/* ── Contrôles : toujours visibles si en pause, sinon apparaissent au hover ── */}
      <div
        className={`absolute inset-0 flex flex-col p-[10px] transition-opacity duration-200 ${
          !playing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {/* ── Ligne du haut ── */}
        <div className="flex flex-row justify-between items-start">
          {/* Icône partage / Facebook */}
          {facebookUrl ? (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-[30px] h-[30px] p-[5px] rounded-full hover:bg-black/50 transition-colors"
              title="Voir sur Facebook"
            >
              <svg viewBox="0 0 20 20" className="w-full h-full fill-[rgb(241,239,239)]">
                <path d="M16.198,10.896c-0.252,0-0.455,0.203-0.455,0.455v2.396c0,0.626-0.511,1.137-1.138,1.137H5.117c-0.627,0-1.138-0.511-1.138-1.137V7.852c0-0.626,0.511-1.137,1.138-1.137h5.315c0.252,0,0.456-0.203,0.456-0.455c0-0.251-0.204-0.455-0.456-0.455H5.117c-1.129,0-2.049,0.918-2.049,2.047v5.894c0,1.129,0.92,2.048,2.049,2.048h9.488c1.129,0,2.048-0.919,2.048-2.048v-2.396C16.653,11.099,16.45,10.896,16.198,10.896z" />
                <path d="M14.053,4.279c-0.207-0.135-0.492-0.079-0.63,0.133c-0.137,0.211-0.077,0.493,0.134,0.63l1.65,1.073c-4.115,0.62-5.705,4.891-5.774,5.082c-0.084,0.236,0.038,0.495,0.274,0.581c0.052,0.019,0.103,0.027,0.154,0.027c0.186,0,0.361-0.115,0.429-0.301c0.014-0.042,1.538-4.023,5.238-4.482l-1.172,1.799c-0.137,0.21-0.077,0.492,0.134,0.629c0.076,0.05,0.163,0.074,0.248,0.074c0.148,0,0.294-0.073,0.382-0.207l1.738-2.671c0.066-0.101,0.09-0.224,0.064-0.343c-0.025-0.118-0.096-0.221-0.197-0.287L14.053,4.279z" />
              </svg>
            </a>
          ) : (
            <div />
          )}

          <div />
        </div>

        {/* ── Barre de progression (milieu) ── */}
        <div className="flex-grow flex justify-center items-end">
          <div
            className="w-full h-[8px] mb-[8px] bg-[rgba(170,163,163,0.356)] rounded-full cursor-pointer relative"
            onClick={seek}
          >
            <div
              className="h-full bg-[rgb(167,57,57)] rounded-full transition-[width] duration-100"
              style={{ width: `${pct}%` }}
            />
            {dur > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md pointer-events-none"
                style={{ left: `calc(${pct}% - 6px)` }}
              />
            )}
          </div>
        </div>

        {/* ── Ligne du bas ── */}
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-[20px]">
            {/* Pause / Play (50×50) */}
            <button
              className="w-[50px] h-[50px] fill-[rgb(241,239,239)]"
              onClick={toggle}
              aria-label={playing ? "Pause" : "Lecture"}
            >
              {playing ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-full h-full fill-[rgb(241,239,239)]">
                  <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-full h-full fill-[rgb(241,239,239)]">
                  <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                </svg>
              )}
            </button>

            {/* Avance rapide +10s */}
            <button
              className="w-[30px] h-[30px] p-[5px] rounded-full hover:bg-black/50 transition-colors"
              onClick={skip}
              aria-label="+10 secondes"
            >
              <svg height="100" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100" width="100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path fill="rgb(241,239,239)" d="M24.7,29.4a4.6,4.6,0,0,0-4.4-.2A4.5,4.5,0,0,0,18.1,33V67a4.5,4.5,0,0,0,2.2,3.8,4.6,4.6,0,0,0,4.4-.2L47.9,55.1V67a4.3,4.3,0,0,0,2.2,3.8,4.6,4.6,0,0,0,4.4-.2L80,53.5a4.2,4.2,0,0,0,0-7L54.5,29.4a4.6,4.6,0,0,0-4.4-.2A4.3,4.3,0,0,0,47.9,33V44.9Z" />
              </svg>
            </button>

            {/* Volume / Muet */}
            <button
              className="w-[30px] h-[30px] p-[5px] rounded-full hover:bg-black/50 transition-colors"
              onClick={toggleMute}
              aria-label={muted ? "Activer le son" : "Couper le son"}
            >
              {muted ? (
                <svg viewBox="0 0 20 20" className="w-full h-full fill-[rgb(241,239,239)]">
                  <path d="M9.344,2.593c-0.253-0.104-0.547-0.045-0.743,0.15L4.486,6.887H1.313c-0.377,0-0.681,0.305-0.681,0.681v4.916c0,0.377,0.304,0.681,0.681,0.681h3.154l4.137,4.142c0.13,0.132,0.304,0.201,0.482,0.201c0.088,0,0.176-0.017,0.261-0.052c0.254-0.105,0.42-0.354,0.42-0.629L9.765,3.224C9.765,2.947,9.599,2.699,9.344,2.593z M5.233,12.003c-0.128-0.127-0.302-0.2-0.483-0.2H1.994V8.249h2.774c0.182,0,0.355-0.072,0.483-0.201l3.151-3.173l0.001,10.305L5.233,12.003z" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" className="w-full h-full fill-[rgb(241,239,239)]">
                  <path d="M9.344,2.593c-0.253-0.104-0.547-0.045-0.743,0.15L4.486,6.887H1.313c-0.377,0-0.681,0.305-0.681,0.681v4.916c0,0.377,0.304,0.681,0.681,0.681h3.154l4.137,4.142c0.13,0.132,0.304,0.201,0.482,0.201c0.088,0,0.176-0.017,0.261-0.052c0.254-0.105,0.42-0.354,0.42-0.629L9.765,3.224C9.765,2.947,9.599,2.699,9.344,2.593z M5.233,12.003c-0.128-0.127-0.302-0.2-0.483-0.2H1.994V8.249h2.774c0.182,0,0.355-0.072,0.483-0.201l3.151-3.173l0.001,10.305L5.233,12.003z" />
                  <path d="M16.434,10.007c0-2.553-1.518-4.853-3.869-5.858C12.223,4,11.821,4.16,11.672,4.506c-0.148,0.346,0.013,0.746,0.359,0.894c1.846,0.793,3.041,2.6,3.041,4.608c0,1.997-1.188,3.799-3.025,4.592c-0.346,0.149-0.505,0.551-0.356,0.895c0.112,0.258,0.362,0.411,0.625,0.411c0.091,0,0.181-0.017,0.269-0.056C14.922,14.843,16.434,12.548,16.434,10.007z" />
                  <path d="M13.418,10.005c0-1.349-0.802-2.559-2.042-3.086c-0.346-0.144-0.745,0.015-0.894,0.362c-0.146,0.346,0.016,0.745,0.362,0.893c0.737,0.312,1.212,1.031,1.212,1.832c0,0.792-0.471,1.509-1.2,1.825c-0.345,0.149-0.504,0.551-0.352,0.895c0.112,0.257,0.362,0.41,0.625,0.41c0.091,0,0.181-0.017,0.27-0.057C12.625,12.545,13.418,11.339,13.418,10.005z" />
                  <path d="M13.724,1.453c-0.345-0.15-0.746,0.012-0.895,0.358c-0.148,0.346,0.013,0.745,0.358,0.894c2.928,1.256,4.819,4.122,4.819,7.303c0,3.171-1.886,6.031-4.802,7.289c-0.346,0.149-0.505,0.55-0.356,0.894c0.112,0.258,0.362,0.412,0.626,0.412c0.09,0,0.181-0.019,0.269-0.056c3.419-1.474,5.626-4.826,5.626-8.54C19.368,6.282,17.152,2.923,13.724,1.453z" />
                </svg>
              )}
            </button>
          </div>

          {/* Temps */}
          <p className="text-[.85em] text-white font-mono tabular-nums">
            {fmt(time)} / {fmt(dur)}
          </p>
        </div>
      </div>
    </div>
  );
}
