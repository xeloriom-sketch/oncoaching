import { useEffect, useRef, useState } from "react";
import { Facebook, Instagram, Mail, MapPin, Phone, ArrowRight, Play, Pause, SkipBack, SkipForward, ChevronsDown } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SERVICES, SOCIAL, SITE } from "@/lib/config";

const NAV_FOOTER = [
  { label: "Accueil",    href: "/" },
  { label: "À Propos",  href: "/about" },
  { label: "Presse",    href: "/presse-medias" },
  { label: "Nos Tarifs", href: "/nos-tarifs" },
  { label: "Contact",   href: "/contact" },
];

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  Facebook:  Facebook,
  Instagram: Instagram,
};

const PODCAST_STORAGE_KEY = "oncoaching_podcast_state_v1";

const Footer = () => {
  const year = new Date().getFullYear();
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const podcastSrc = `${import.meta.env.BASE_URL}Podcast%20et%20Compagnie%20-%20Noureddine%20Omar.mp3`;
  const podcastCover = "https://assets.pippa.io/shows/64a44bff1355cb0011b8142a/1769533670960-407c032a-8a77-477e-971a-d909a4ba3cb3.jpeg";

  const formatTime = (value: number) => {
    if (!Number.isFinite(value) || value < 0) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const openAndPlay = () => {
    setPlayerOpen(true);
    setPlaying(true);
    const audio = audioRef.current;
    if (!audio) return;
    void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      return;
    }
    audio.pause();
    setPlaying(false);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PODCAST_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        open?: boolean;
        playing?: boolean;
        time?: number;
      };
      if (typeof parsed.open === "boolean") setPlayerOpen(parsed.open);
      if (typeof parsed.playing === "boolean") setPlaying(parsed.playing);
      if (typeof parsed.time === "number" && Number.isFinite(parsed.time) && parsed.time >= 0) {
        setCurrentTime(parsed.time);
      }
    } catch {
      // ignore malformed localStorage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        PODCAST_STORAGE_KEY,
        JSON.stringify({ open: playerOpen, playing, time: currentTime })
      );
    } catch {
      // ignore write errors
    }
  }, [playerOpen, playing, currentTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!playerOpen) {
      audio.pause();
      setPlaying(false);
      return;
    }
    if (playing) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playerOpen, playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      const ratio = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      setProgress(Number.isFinite(ratio) ? ratio : 0);
      setCurrentTime(audio.currentTime || 0);
    };
    const onMetaLoaded = () => {
      setDuration(audio.duration || 0);
      if (currentTime > 0 && currentTime < (audio.duration || Infinity)) {
        audio.currentTime = currentTime;
      }
    };
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setPlaying(false);
      setProgress(100);
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onMetaLoaded);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onMetaLoaded);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentTime]);

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const next = (value / 100) * audio.duration;
    audio.currentTime = next;
    setProgress(value);
    setCurrentTime(next);
  };

  const skipBy = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    const next = Math.min(Math.max(audio.currentTime + seconds, 0), audio.duration);
    audio.currentTime = next;
    setCurrentTime(next);
    const ratio = audio.duration ? (next / audio.duration) * 100 : 0;
    setProgress(Number.isFinite(ratio) ? ratio : 0);
  };

  return (
    <>
      {/* ── Podcast player style Spotify ────────────────── */}
      <aside aria-label="Lecteur podcast" className="fixed inset-x-0 bottom-4 z-50 px-4 md:px-8">
        <audio
          ref={audioRef}
          src={podcastSrc}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          className="hidden"
        />
        <AnimatePresence mode="wait">
          {playerOpen ? (
            <motion.div
              key="spotify-bar"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              className="ml-auto w-full max-w-[430px]"
            >
              <div className="main-music-card">
                <div className="track-info">
                  <img
                    src={podcastCover}
                    alt="Podcast et Compagnie"
                    className="album-art"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="track-details">
                    <p className="track-title">Podcast et Compagnie - Noureddine Omar</p>
                    <p className="artist-name">Podcast et Compagnie par Romain MAURY</p>
                  </div>
                  <div className="volume-bars" aria-hidden="true">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="bar"
                        style={{
                          animationDelay: `${i * 0.1}s`,
                          animationPlayState: playing ? "running" : "paused",
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setPlayerOpen(false)}
                    aria-label="Réduire le lecteur podcast"
                    className="shrink-0 text-[11px] text-white/60 hover:text-white transition-colors inline-flex items-center gap-1 px-2 py-1 rounded-full hover:bg-white/10"
                  >
                    Réduire <ChevronsDown size={12} />
                  </button>
                </div>

                <div className="playback-controls">
                  <div className="time-info">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="progress-wrap">
                    <div className="progress-track" aria-hidden="true" />
                    <div className="progress-fill" style={{ width: `${progress}%` }} aria-hidden="true" />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={0.1}
                      value={progress}
                      onChange={(e) => handleSeek(Number(e.target.value))}
                      aria-label="Avancement du podcast"
                      className="progress-seek"
                    />
                  </div>
                  <div className="button-row">
                    <button className="control-button" onClick={() => skipBy(-10)} aria-label="Reculer de 10 secondes">
                      <SkipBack size={20} />
                    </button>
                    <button className="control-button play-pause" onClick={togglePlayPause} aria-label={playing ? "Mettre en pause" : "Relancer la lecture"}>
                      {playing ? <Pause size={24} className="fill-white" /> : <Play size={24} className="ml-0.5 fill-white" />}
                    </button>
                    <button className="control-button" onClick={() => skipBy(10)} aria-label="Avancer de 10 secondes">
                      <SkipForward size={20} />
                    </button>
                  </div>
                </div>
              </div>
              <style>{`
                .main-music-card {
                  width: 100%;
                  padding: 18px;
                  border-radius: 28px;
                  background: #000;
                  box-shadow: 0 10px 28px rgba(0,0,0,.45);
                  display: flex;
                  flex-direction: column;
                  gap: 14px;
                  color: white;
                }
                .track-info { display:flex; align-items:center; gap:12px; min-width:0; }
                .album-art {
                  width: 64px; height: 64px; border-radius: 14px; object-fit: cover; flex-shrink:0;
                  box-shadow: 0 6px 14px rgba(0,0,0,.45);
                }
                .track-details { min-width:0; flex:1; }
                .track-title { font-size: .95rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .artist-name { font-size: .75rem; color: #a1a1aa; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .volume-bars { display:flex; align-items:flex-end; gap:2px; width:38px; height:28px; }
                .volume-bars .bar {
                  width: 3px; background: linear-gradient(180deg,#C4903E,#E8C07A); border-radius: 2px;
                  animation: bounce .8s infinite ease-in-out;
                }
                .playback-controls { display:flex; flex-direction:column; gap:8px; }
                .time-info { display:flex; justify-content:space-between; font-size:.72rem; color:#8e8e93; font-variant-numeric: tabular-nums; }
                .progress-wrap { position:relative; height:16px; display:flex; align-items:center; }
                .progress-track { position:absolute; inset-inline:0; height:4px; border-radius:999px; background: rgba(255,255,255,.14); }
                .progress-fill { position:absolute; left:0; height:4px; border-radius:999px; background: linear-gradient(90deg,#C4903E,#E8C07A); }
                .progress-seek {
                  position:relative; width:100%; appearance:none; background:transparent; cursor:pointer;
                }
                .progress-seek::-webkit-slider-runnable-track { height:4px; background: transparent; }
                .progress-seek::-webkit-slider-thumb {
                  appearance:none; width:10px; height:10px; border-radius:50%; background:#fff; border:1px solid #C4903E; margin-top:-3px;
                }
                .progress-seek::-moz-range-track { height:4px; background:transparent; }
                .progress-seek::-moz-range-thumb { width:10px; height:10px; border-radius:50%; background:#fff; border:1px solid #C4903E; }
                .button-row { display:flex; align-items:center; justify-content:center; gap:10px; }
                .control-button {
                  width:42px; height:42px; border-radius:999px; border:none; background:transparent; color:#fff;
                  display:flex; align-items:center; justify-content:center; cursor:pointer; transition:.2s;
                }
                .control-button:hover { background: rgba(255,255,255,.1); transform: scale(1.05); }
                .control-button.play-pause { width:50px; height:50px; background:#C4903E; }
                .control-button.play-pause:hover { background:#15a2b3; }
                @keyframes bounce { 0%,100% { height:6px; } 50% { height:24px; } }
              `}</style>
            </motion.div>
          ) : (
            <motion.button
              key="fab-play"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={openAndPlay}
              aria-label="Ouvrir le lecteur podcast"
              className="ml-auto w-14 h-14 bg-[#C4903E] text-white rounded-full shadow-xl flex items-center justify-center"
            >
              <Play size={18} className="ml-0.5 fill-white" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </aside>

      {/* ── Footer principal ─────────────────────────── */}
      <footer className="bg-[#1C3A52] text-white" aria-label="Pied de page">
        <div className="max-w-7xl mx-auto px-4 md:px-12 pt-20 pb-16">

          {/* CTA strip */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-20">
            <div>
              <p className="text-[11px] font-mono tracking-widest uppercase text-white/30 mb-5" aria-hidden="true">
                ONCOACHING · SANCÉ (MÂCON), FRANCE
              </p>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight leading-[1.05] text-white">
                Passez au niveau<br />supérieur.
              </h2>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-4">
              <p className="text-white/40 text-[14px] font-light leading-relaxed max-w-xs lg:text-right">
                Consultation initiale offerte. Sans engagement. Disponible pour de nouveaux accompagnements.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="bg-[#C4903E] text-white font-bold text-[13px] px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  Contacter un coach
                </Link>
                <Link
                  to="/about"
                  className="border border-white/15 text-white/60 hover:text-white font-medium text-[13px] px-6 py-3 rounded-full hover:border-white/30 transition-all"
                >
                  En savoir plus
                </Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-0 border-t border-white/8 mb-16" />

          {/* Links grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-16">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" aria-label="ON Coaching — Accueil" className="flex items-center gap-2 mb-4 group whitespace-nowrap">
                <div className="bg-white rounded-[7px] p-[3px] flex-shrink-0">
                  <LogoMark size={24} />
                </div>
                <span className="font-bold text-[14px] tracking-tight">
                  <span className="text-[#C4903E]">ON</span><span className="group-hover:text-[#C4903E] transition-colors text-white">Coaching</span>
                </span>
              </Link>
              <p className="text-white/35 text-[13px] leading-relaxed mb-5">
                Coaching certifié. Mâcon, France. Pour les étudiants, les jeunes adultes et les équipes.
              </p>
              <nav aria-label="Réseaux sociaux" className="flex gap-2">
                {SOCIAL.map(({ platform, href }) => {
                  const Icon = SOCIAL_ICONS[platform] ?? ArrowRight;
                  return (
                    <a
                      key={platform}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform}
                      className="w-10 h-10 rounded-full bg-white/8 hover:bg-[#C4903E]/20 flex items-center justify-center text-white/40 hover:text-[#C4903E] transition-all border border-white/8"
                    >
                      <Icon size={13} aria-hidden="true" />
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Navigation */}
            <nav aria-label="Navigation principale">
              <p className="text-[10px] font-mono tracking-widest uppercase text-white/30 mb-4" aria-hidden="true">Navigation</p>
              <ul className="space-y-2.5">
                {NAV_FOOTER.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      to={href}
                      className="text-white/50 hover:text-[#C4903E] text-[13px] font-medium transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Services */}
            <nav aria-label="Nos services">
              <p className="text-[10px] font-mono tracking-widest uppercase text-white/30 mb-4" aria-hidden="true">Services</p>
              <ul className="space-y-2.5">
                {SERVICES.map(s => (
                  <li key={s.href}>
                    <Link
                      to={s.href}
                      className="text-white/50 hover:text-[#C4903E] text-[13px] font-medium transition-colors"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <address className="not-italic">
              <p className="text-[10px] font-mono tracking-widest uppercase text-white/30 mb-4" aria-hidden="true">Contact</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C4903E]/60 flex-shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  <span className="text-white/40 text-[13px]">14 rue des écureuils, 71000 Sancé</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-[#C4903E]/60 flex-shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  <a href={`tel:${SITE.phone}`} className="text-white/40 hover:text-white text-[13px] transition-colors">
                    +33 06 63 04 18 12
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-[#C4903E]/60 flex-shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  <a href={`mailto:${SITE.email}`} className="text-white/40 hover:text-white text-[13px] transition-colors">
                    {SITE.email}
                  </a>
                </li>
              </ul>
            </address>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-8 border-t border-white/8">
            <p className="text-white/25 text-[11px] font-mono">
              © {year} ONCoaching · Tous droits réservés.{" "}
              Site par{" "}
              <a
                href="https://www.alhambra-web.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#C4903E] transition-colors font-semibold"
              >
                Alhambra Web
              </a>
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C4903E] animate-pulse" aria-hidden="true" />
              <span className="text-white/25 text-[11px] font-mono">Disponible pour de nouveaux accompagnements</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
