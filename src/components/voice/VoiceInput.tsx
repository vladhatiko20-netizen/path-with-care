import { useEffect, useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";
import { useVoiceCapability } from "./use-voice-capability";
import { transcribeAudio } from "@/lib/voice.functions";

const MAX_DURATION_MS = 60_000;

type Meta = { lang: "ru" | "ro" | null };

type Props = {
  onTranscript: (text: string, meta: Meta) => void;
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
};

function pickMimeType(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  const candidates = ["audio/webm", "audio/mp4"];
  for (const c of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(c)) return c;
    } catch {
      /* ignore */
    }
  }
  return null;
}

export function VoiceInput({
  onTranscript,
  size = "sm",
  className,
  ariaLabel,
}: Props) {
  const { t } = useLang();
  const cap = useVoiceCapability();
  const [hidden, setHidden] = useState(false);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const tickTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
      if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

  if (!cap.available || hidden) return null;

  async function startRecording() {
    if (recording || busy) return;
    const mime = pickMimeType();
    if (!mime) {
      toast.error(t("Браузер не поддерживает запись.", "Browserul nu acceptă înregistrarea."));
      setHidden(true);
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      toast.error(
        t(
          "Не удалось получить доступ к микрофону. Введите текст вручную.",
          "Nu s-a putut accesa microfonul. Introduceți textul manual.",
        ),
      );
      setHidden(true);
      return;
    }
    streamRef.current = stream;
    chunksRef.current = [];
    const rec = new MediaRecorder(stream, { mimeType: mime });
    recorderRef.current = rec;
    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.onstop = async () => {
      if (stopTimerRef.current) {
        window.clearTimeout(stopTimerRef.current);
        stopTimerRef.current = null;
      }
      if (tickTimerRef.current) {
        window.clearInterval(tickTimerRef.current);
        tickTimerRef.current = null;
      }
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
      setRecording(false);
      setElapsed(0);

      const blob = new Blob(chunksRef.current, { type: rec.mimeType });
      chunksRef.current = [];
      if (blob.size < 1024) {
        toast.error(t("Запись пуста, попробуйте ещё раз.", "Înregistrarea este goală, încercați din nou."));
        return;
      }
      setBusy(true);
      try {
        const fd = new FormData();
        fd.append("audio", blob);
        const res = await transcribeAudio({ data: fd });
        if (!res?.text) {
          toast.error(
            t("Не удалось распознать. Введите текст вручную.", "Nu s-a putut recunoaște. Introduceți textul manual."),
          );
          return;
        }
        onTranscript(res.text, { lang: res.lang ?? null });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("rate_limit")) {
          toast.error(
            t(
              "Слишком много запросов. Попробуйте через час.",
              "Prea multe cereri. Încercați peste o oră.",
            ),
          );
        } else if (msg.includes("audio_too_large")) {
          toast.error(t("Запись слишком большая.", "Înregistrarea este prea mare."));
        } else if (msg.includes("voice_unavailable")) {
          toast.error(t("Голосовой ввод временно недоступен.", "Introducerea vocală este temporar indisponibilă."));
          setHidden(true);
        } else {
          toast.error(t("Не удалось распознать. Введите текст вручную.", "Nu s-a putut recunoaște. Introduceți textul manual."));
        }
        console.error("[voice] transcribe failed", err);
      } finally {
        setBusy(false);
      }
    };

    rec.start();
    setRecording(true);
    setElapsed(0);
    const startedAt = Date.now();
    tickTimerRef.current = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 250);
    stopTimerRef.current = window.setTimeout(() => {
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    }, MAX_DURATION_MS);
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  const sizeClasses =
    size === "md"
      ? "h-12 w-12 md:h-14 md:w-14"
      : "h-10 w-10";
  const iconSize = size === "md" ? "w-5 h-5 md:w-6 md:h-6" : "w-4 h-4";

  const label = recording
    ? t("Остановить запись", "Oprește înregistrarea")
    : busy
      ? t("Распознаём…", "Se recunoaște…")
      : t("Сказать вместо печатать", "Spune în loc să scrii");

  return (
    <button
      type="button"
      onClick={recording ? stopRecording : startRecording}
      disabled={busy}
      aria-label={ariaLabel ?? label}
      title={label}
      className={`inline-flex items-center justify-center rounded-full border transition-colors shrink-0 ${sizeClasses} ${
        recording
          ? "bg-accent text-primary-foreground border-accent animate-pulse"
          : busy
            ? "bg-card border-border text-muted-foreground"
            : "bg-card border-gold/40 text-accent hover:bg-gold/10 hover:border-gold"
      } ${className ?? ""}`}
    >
      {busy ? (
        <Loader2 className={`${iconSize} animate-spin`} aria-hidden="true" />
      ) : recording ? (
        <span className="flex items-center gap-1">
          <Square className={iconSize} aria-hidden="true" />
          <span className="text-[11px] font-medium tabular-nums">{elapsed}</span>
        </span>
      ) : (
        <Mic className={iconSize} aria-hidden="true" />
      )}
    </button>
  );
}