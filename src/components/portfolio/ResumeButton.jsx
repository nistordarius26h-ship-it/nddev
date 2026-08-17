import { Download } from "lucide-react";
import { downloadResume } from "@/lib/resume";

export function ResumeButton({ className = "" }) {
  return (
    <button
      type="button"
      onClick={downloadResume}
      className={`group inline-flex items-center justify-center gap-2 border hairline text-white mono text-xs uppercase tracking-[0.2em] font-medium px-6 py-4 hover:bg-white hover:text-[#050505] transition-colors ${className}`}
    >
      <Download size={14} />
      Download Resume
    </button>
  );
}