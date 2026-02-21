import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { CitationCard, type Citation } from "./citation-card";
import hljs from "highlight.js";
import katex from "katex";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";

interface CitationProcessorProps {
  htmlContent: string;
  className?: string;
}

function extractCitations(html: string): { citations: Citation[]; processedHtml: string } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Find the References heading
  const headings = doc.querySelectorAll("h2");
  let referencesHeading: HTMLElement | null = null;
  headings.forEach((h) => {
    const text = h.textContent?.trim().toLowerCase() || "";
    if (text === "references" || text === "bibliography" || text === "sources") {
      referencesHeading = h as HTMLElement;
    }
  });

  if (!referencesHeading) {
    return { citations: [], processedHtml: html };
  }

  // Extract citation data from the References section
  const citations: Citation[] = [];
  let sibling = referencesHeading.nextElementSibling;
  while (sibling) {
    const text = sibling.textContent || "";
    const match = text.match(/^\[(\d+)\]\s*([\s\S]*)/);
    if (match) {
      const linkEl = sibling.querySelector("a");
      citations.push({
        number: parseInt(match[1]),
        text: match[2].trim(),
        url: linkEl?.href,
      });
    }
    sibling = sibling.nextElementSibling;
  }

  if (citations.length === 0) {
    return { citations: [], processedHtml: html };
  }

  // Split HTML at the references heading to only process body text
  const refMatch = html.match(/<h2[^>]*>\s*References\s*<\/h2>/i);
  if (!refMatch || refMatch.index === undefined) {
    return { citations, processedHtml: html };
  }

  const bodyHtml = html.substring(0, refMatch.index);
  const refsHtml = html.substring(refMatch.index);

  // Replace [N] with interactive spans, skip anything inside HTML tags
  const processedBody = bodyHtml.replace(
    /(<[^>]*>)|(\[(\d+)\])/g,
    (match, tag, citation, num) => {
      if (tag) return tag;
      if (citation) {
        const citNum = parseInt(num);
        if (citations.some((c) => c.number === citNum)) {
          return `<span class="citation-ref" data-citation="${citNum}">${citation}</span>`;
        }
      }
      return match;
    }
  );

  // Add IDs to reference paragraphs so we can scroll to them
  const processedRefs = refsHtml.replace(
    /(<p>)(\[(\d+)\])/g,
    (match, pTag, citation, num) => {
      return `<p id="ref-${num}">${citation}`;
    }
  );

  return { citations, processedHtml: processedBody + processedRefs };
}

export function CitationProcessor({ htmlContent, className }: CitationProcessorProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeCitation, setActiveCitation] = useState<number | null>(null);
  const [pinnedCitation, setPinnedCitation] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number }>({ top: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTooltipPos, setMobileTooltipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const { citations, processedHtml } = useMemo(
    () => extractCitations(htmlContent),
    [htmlContent]
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close pinned citation when clicking outside
  useEffect(() => {
    if (pinnedCitation === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.classList.contains("citation-ref") ||
        target.closest(".citation-card")
      ) {
        return;
      }
      setPinnedCitation(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [pinnedCitation]);

  const updatePosition = useCallback(
    (target: HTMLElement) => {
      const rect = target.getBoundingClientRect();
      if (isMobile) {
        setMobileTooltipPos({
          top: rect.bottom + window.scrollY + 8,
          left: Math.max(16, Math.min(rect.left, window.innerWidth - 240)),
        });
      } else if (contentRef.current) {
        const containerTop = contentRef.current.getBoundingClientRect().top + window.scrollY;
        setTooltipPos({
          top: rect.top + window.scrollY - containerTop,
        });
      }
    },
    [isMobile]
  );

  const handleMouseOver = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains("citation-ref")) return;
      if (pinnedCitation !== null) return; // Don't override pinned state with hover

      const num = parseInt(target.getAttribute("data-citation") || "0");
      if (!num) return;

      updatePosition(target);
      setActiveCitation(num);
    },
    [pinnedCitation, updatePosition]
  );

  const handleMouseOut = useCallback(
    (e: React.MouseEvent) => {
      if (pinnedCitation !== null) return; // Don't hide if pinned
      const related = e.relatedTarget as HTMLElement | null;
      if (related?.classList?.contains("citation-ref")) return;
      setActiveCitation(null);
    },
    [pinnedCitation]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains("citation-ref")) return;

      const num = parseInt(target.getAttribute("data-citation") || "0");
      if (!num) return;

      updatePosition(target);

      // Toggle pin: click same = unpin, click different = pin new
      if (pinnedCitation === num) {
        setPinnedCitation(null);
        setActiveCitation(null);
      } else {
        setPinnedCitation(num);
        setActiveCitation(num);
      }
    },
    [pinnedCitation, updatePosition]
  );

  const scrollToReference = useCallback((num: number) => {
    const refEl = contentRef.current?.querySelector(`#ref-${num}`);
    if (refEl) {
      refEl.scrollIntoView({ behavior: "smooth", block: "center" });
      // Briefly highlight the reference
      refEl.classList.add("citation-highlight");
      setTimeout(() => refEl.classList.remove("citation-highlight"), 2000);
    }
    setPinnedCitation(null);
    setActiveCitation(null);
  }, []);

  // Syntax highlighting + copy buttons + KaTeX after each render
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // --- Syntax highlighting ---
    container.querySelectorAll("pre code").forEach((block) => {
      if (!(block as HTMLElement).dataset.highlighted) {
        hljs.highlightElement(block as HTMLElement);
      }
    });

    // --- Copy buttons on <pre> blocks ---
    container.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return; // already added
      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", () => {
        const code = pre.querySelector("code")?.innerText || "";
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = "Copied!";
          setTimeout(() => (btn.textContent = "Copy"), 2000);
        });
      });
      pre.style.position = "relative";
      pre.appendChild(btn);
    });

    // --- KaTeX math rendering ---
    container.querySelectorAll(".math-block[data-math]").forEach((el) => {
      const encoded = el.getAttribute("data-math") || "";
      try {
        const expr = atob(encoded);
        el.innerHTML = katex.renderToString(expr, { displayMode: true, throwOnError: false });
        el.removeAttribute("data-math");
      } catch {}
    });

    container.querySelectorAll(".math-inline[data-math]").forEach((el) => {
      const encoded = el.getAttribute("data-math") || "";
      try {
        const expr = atob(encoded);
        el.innerHTML = katex.renderToString(expr, { displayMode: false, throwOnError: false });
        el.removeAttribute("data-math");
      } catch {}
    });
  }, [processedHtml]);

  const displayNum = pinnedCitation ?? activeCitation;
  const activeCitationData = citations.find((c) => c.number === displayNum);
  const isPinned = pinnedCitation !== null && activeCitationData !== undefined;

  return (
    <div className="relative">
      {/* Left margin citation area — desktop only */}
      {!isMobile && activeCitationData && (
        <aside className="hidden lg:block absolute right-full mr-6 w-56 top-0">
          <CitationCard
            citation={activeCitationData}
            style={{ position: "absolute", top: tooltipPos.top }}
            pinned={isPinned}
            onScrollToRef={scrollToReference}
          />
        </aside>
      )}

      {/* Main content */}
      <div
        ref={contentRef}
        className={className}
        dangerouslySetInnerHTML={{ __html: processedHtml }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={handleClick}
      />

      {/* Mobile floating citation card */}
      {isMobile && activeCitationData && (
        <div
          className="fixed z-50"
          style={{
            top: mobileTooltipPos.top,
            left: mobileTooltipPos.left,
            maxWidth: "calc(100vw - 32px)",
          }}
        >
          <CitationCard
            citation={activeCitationData}
            pinned={isPinned}
            onScrollToRef={scrollToReference}
          />
        </div>
      )}
    </div>
  );
}
