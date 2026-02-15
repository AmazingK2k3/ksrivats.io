import { ExternalLink, ArrowDown } from "lucide-react";

export interface Citation {
  number: number;
  text: string;
  url?: string;
}

interface CitationCardProps {
  citation: Citation;
  style?: React.CSSProperties;
  pinned?: boolean;
  onScrollToRef?: (num: number) => void;
}

export function CitationCard({ citation, style, pinned, onScrollToRef }: CitationCardProps) {
  return (
    <div
      className={`citation-card citation-card-enter ${pinned ? "citation-card-pinned" : ""}`}
      style={style}
    >
      <span className="font-semibold text-primary text-xs">[{citation.number}]</span>
      <p className="mt-1 text-xs leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
        {citation.text}
      </p>
      <div className="flex items-center gap-3 mt-2">
        {citation.url && (
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-xs hover:underline inline-flex items-center gap-1"
          >
            Source <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {onScrollToRef && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onScrollToRef(citation.number);
            }}
            className="text-primary text-xs hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Jump <ArrowDown className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
