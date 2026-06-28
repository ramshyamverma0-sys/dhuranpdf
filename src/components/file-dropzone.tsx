import { useRef, useState, type ReactNode } from "react";
import { UploadCloud, X } from "lucide-react";

export function FileDropzone({
  accept,
  multiple,
  files,
  onFiles,
  hint,
}: {
  accept?: string;
  multiple?: boolean;
  files: File[];
  onFiles: (files: File[]) => void;
  hint?: ReactNode;
}) {
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handle = (list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list);
    onFiles(multiple ? [...files, ...arr] : arr.slice(0, 1));
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
        onClick={() => ref.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${drag ? "border-primary bg-primary-soft" : "border-border hover:border-primary/50 hover:bg-accent/40"}`}
      >
        <UploadCloud className="mx-auto h-10 w-10 text-primary mb-2" />
        <div className="text-sm font-medium">Click to upload or drag & drop</div>
        <div className="text-xs text-muted-foreground mt-1">{hint}</div>
        <input
          ref={ref}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handle(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-secondary text-sm">
              <span className="truncate">{f.name} <span className="text-muted-foreground">· {(f.size / 1024).toFixed(1)} KB</span></span>
              <button
                onClick={(e) => { e.stopPropagation(); onFiles(files.filter((_, j) => j !== i)); }}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
