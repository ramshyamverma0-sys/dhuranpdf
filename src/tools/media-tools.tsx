import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Btn, Field, Input } from "@/components/tool-page";
import { FileDropzone, download } from "@/components/file-dropzone";
import { Loader2, Mic, Square, Play } from "lucide-react";

/* ---------------- Video Thumbnail Extractor ---------------- */
export function VideoThumbnail() {
  const [files, setFiles] = useState<File[]>([]);
  const [time, setTime] = useState(1);
  const [thumb, setThumb] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!files[0]) return toast.error("Add a video");
    setBusy(true);
    try {
      const url = URL.createObjectURL(files[0]);
      const v = document.createElement("video");
      v.src = url; v.crossOrigin = "anonymous"; v.muted = true; v.playsInline = true;
      await new Promise<void>((res, rej) => { v.onloadedmetadata = () => res(); v.onerror = () => rej(new Error("Cannot load video")); });
      v.currentTime = Math.min(time, Math.max(0, v.duration - 0.05));
      await new Promise<void>((res) => { v.onseeked = () => res(); });
      const c = document.createElement("canvas");
      c.width = v.videoWidth; c.height = v.videoHeight;
      c.getContext("2d")!.drawImage(v, 0, 0);
      c.toBlob((b) => {
        if (!b) return;
        const u = URL.createObjectURL(b);
        setThumb(u);
        download(b, files[0].name.replace(/\.[^.]+$/, "") + `-thumb-${time}s.png`);
      }, "image/png");
      URL.revokeObjectURL(url);
      toast.success("Thumbnail saved");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <FileDropzone accept="video/*" files={files} onFiles={setFiles} hint="MP4, WebM, MOV — captures one frame as PNG" />
      <Field label={`Capture at ${time}s`}><input type="range" min={0} max={60} step={0.1} value={time} onChange={(e) => setTime(+e.target.value)} className="w-full accent-primary" /></Field>
      <Btn onClick={run} disabled={busy || !files.length}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Extract thumbnail</Btn>
      {thumb && <img src={thumb} alt="thumb" className="rounded-lg border border-border max-h-80 mx-auto" />}
    </div>
  );
}

/* ---------------- Video Metadata Viewer ---------------- */
export function VideoMetadata() {
  const [files, setFiles] = useState<File[]>([]);
  const [info, setInfo] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    if (!files[0]) return setInfo(null);
    const url = URL.createObjectURL(files[0]);
    const v = document.createElement("video");
    v.preload = "metadata"; v.src = url;
    v.onloadedmetadata = () => {
      setInfo({
        "File name": files[0].name,
        "File size": (files[0].size / 1024 / 1024).toFixed(2) + " MB",
        "Type": files[0].type || "—",
        "Duration": v.duration.toFixed(2) + " s",
        "Resolution": `${v.videoWidth} × ${v.videoHeight}`,
        "Aspect ratio": (v.videoWidth / v.videoHeight).toFixed(3),
      });
      URL.revokeObjectURL(url);
    };
    v.onerror = () => { setInfo({ Error: "Cannot read this file" }); URL.revokeObjectURL(url); };
  }, [files]);

  return (
    <div className="space-y-5">
      <FileDropzone accept="video/*" files={files} onFiles={setFiles} hint="Reads metadata locally — nothing uploaded" />
      {info && (
        <div className="rounded-lg border border-border bg-surface divide-y divide-border">
          {Object.entries(info).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Audio Metadata ---------------- */
export function AudioMetadata() {
  const [files, setFiles] = useState<File[]>([]);
  const [info, setInfo] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    if (!files[0]) return setInfo(null);
    const url = URL.createObjectURL(files[0]);
    const a = document.createElement("audio");
    a.preload = "metadata"; a.src = url;
    a.onloadedmetadata = () => {
      const sec = a.duration;
      setInfo({
        "File name": files[0].name,
        "File size": (files[0].size / 1024).toFixed(1) + " KB",
        "Type": files[0].type || "—",
        "Duration": `${Math.floor(sec / 60)}m ${(sec % 60).toFixed(1)}s`,
      });
      URL.revokeObjectURL(url);
    };
    a.onerror = () => { setInfo({ Error: "Cannot read this file" }); URL.revokeObjectURL(url); };
  }, [files]);

  return (
    <div className="space-y-5">
      <FileDropzone accept="audio/*" files={files} onFiles={setFiles} hint="MP3, WAV, OGG, M4A" />
      {info && (
        <div className="rounded-lg border border-border bg-surface divide-y divide-border">
          {Object.entries(info).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Voice Recorder ---------------- */
export function VoiceRecorder() {
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState("");
  const [secs, setSecs] = useState(0);
  const chunksRef = useRef<Blob[]>([]);
  const tRef = useRef<number | null>(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        setUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setRec(mr); setRecording(true); setSecs(0);
      tRef.current = window.setInterval(() => setSecs((s) => s + 1), 1000);
    } catch (e: any) { toast.error(e.message || "Mic access denied"); }
  };

  const stop = () => {
    rec?.stop(); setRecording(false);
    if (tRef.current) { clearInterval(tRef.current); tRef.current = null; }
  };

  const save = async () => {
    if (!url) return;
    const blob = await fetch(url).then((r) => r.blob());
    download(blob, `recording-${Date.now()}.webm`);
  };

  return (
    <div className="space-y-5 text-center">
      <div className="text-5xl font-mono tabular-nums">{String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}</div>
      <div className="flex justify-center gap-3">
        {!recording ? (
          <Btn onClick={start}><Mic className="h-4 w-4" />Start recording</Btn>
        ) : (
          <Btn variant="secondary" onClick={stop}><Square className="h-4 w-4" />Stop</Btn>
        )}
      </div>
      {url && (
        <div className="space-y-3">
          <audio src={url} controls className="w-full" />
          <Btn onClick={save}>Download recording</Btn>
        </div>
      )}
    </div>
  );
}

/* ---------------- Audio Player / Preview ---------------- */
export function MediaPlayer({ slug }: { slug: string }) {
  const isVideo = slug === "video-player";
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!files[0]) return setUrl("");
    const u = URL.createObjectURL(files[0]);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [files]);

  return (
    <div className="space-y-5">
      <FileDropzone accept={isVideo ? "video/*" : "audio/*"} files={files} onFiles={setFiles} hint="Plays locally — never uploaded" />
      {url && (isVideo
        ? <video src={url} controls className="w-full rounded-lg border border-border max-h-[480px]" />
        : <audio src={url} controls className="w-full" />)}
    </div>
  );
}

/* ---------------- Video to GIF-ish (download as WebM segment) ----------------
   Browsers can't write GIF natively; provide a simple trim-to-WebM tool */
export function VideoTrimmer() {
  const [files, setFiles] = useState<File[]>([]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(5);
  const [duration, setDuration] = useState(0);
  const [busy, setBusy] = useState(false);
  const [outUrl, setOutUrl] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!files[0]) return;
    const v = document.createElement("video");
    v.preload = "metadata"; v.src = URL.createObjectURL(files[0]);
    v.onloadedmetadata = () => { setDuration(v.duration); setEnd(Math.min(5, v.duration)); URL.revokeObjectURL(v.src); };
  }, [files]);

  const run = async () => {
    if (!files[0]) return toast.error("Add a video");
    if (end <= start) return toast.error("End must be after start");
    setBusy(true);
    try {
      const url = URL.createObjectURL(files[0]);
      const v = document.createElement("video");
      v.src = url; v.muted = true; v.playsInline = true;
      await new Promise<void>((res, rej) => { v.onloadedmetadata = () => res(); v.onerror = () => rej(new Error("Cannot load video")); });
      // @ts-ignore - captureStream is widely supported
      const stream: MediaStream = (v as any).captureStream ? (v as any).captureStream() : (v as any).mozCaptureStream();
      const mr = new MediaRecorder(stream, { mimeType: "video/webm" });
      const chunks: Blob[] = [];
      mr.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      const done = new Promise<Blob>((res) => { mr.onstop = () => res(new Blob(chunks, { type: "video/webm" })); });
      v.currentTime = start;
      await new Promise<void>((res) => { v.onseeked = () => res(); });
      mr.start();
      await v.play();
      await new Promise((res) => setTimeout(res, (end - start) * 1000));
      v.pause();
      mr.stop();
      const blob = await done;
      const out = URL.createObjectURL(blob);
      setOutUrl(out);
      download(blob, files[0].name.replace(/\.[^.]+$/, "") + `-trim-${start}-${end}.webm`);
      URL.revokeObjectURL(url);
      toast.success("Trimmed clip saved");
    } catch (e: any) { toast.error(e.message || "Trim failed (browser may not support captureStream on this codec)"); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <FileDropzone accept="video/*" files={files} onFiles={setFiles} hint="Outputs WebM (browser-native; works in Chrome/Edge/Firefox)" />
      {duration > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <Field label={`Start: ${start.toFixed(1)}s`}><input type="range" min={0} max={duration} step={0.1} value={start} onChange={(e) => setStart(+e.target.value)} className="w-full accent-primary" /></Field>
          <Field label={`End: ${end.toFixed(1)}s`}><input type="range" min={0} max={duration} step={0.1} value={end} onChange={(e) => setEnd(+e.target.value)} className="w-full accent-primary" /></Field>
        </div>
      )}
      <Btn onClick={run} disabled={busy || !files.length}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Trim & download</Btn>
      {outUrl && <video ref={videoRef} src={outUrl} controls className="w-full rounded-lg border border-border max-h-80" />}
    </div>
  );
}

/* ---------------- YouTube Embed Player from URL (no download) ---------------- */
export function YouTubePlayer() {
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const id = (() => {
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
    return m?.[1] || "";
  })();
  return (
    <div className="space-y-5">
      <Field label="YouTube URL"><Input value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
      {id ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
          <iframe src={`https://www.youtube.com/embed/${id}`} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        </div>
      ) : <div className="text-sm text-muted-foreground">Paste a valid YouTube URL to preview.</div>}
    </div>
  );
}
