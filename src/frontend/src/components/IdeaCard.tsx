import { useState } from "react";
import { Star, Trash2 } from "lucide-react";
import type { Idea } from "../backend.d";

interface IdeaCardProps {
  idea: Idea;
  onToggleFavorite: (id: bigint) => void;
  onDelete: (id: bigint) => void;
  animDelay?: number;
}

// Category color mapping — warm palette
const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Technology: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-400",
  },
  Business: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-400",
  },
  "Art & Design": {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-400",
  },
  Science: {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-700 dark:text-violet-300",
    dot: "bg-violet-400",
  },
  Health: {
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-700 dark:text-teal-300",
    dot: "bg-teal-400",
  },
  Education: {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-400",
  },
  Travel: {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-700 dark:text-cyan-300",
    dot: "bg-cyan-400",
  },
  Food: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-400",
  },
  Finance: {
    bg: "bg-lime-50 dark:bg-lime-950/40",
    text: "text-lime-700 dark:text-lime-300",
    dot: "bg-lime-400",
  },
  Personal: {
    bg: "bg-pink-50 dark:bg-pink-950/40",
    text: "text-pink-700 dark:text-pink-300",
    dot: "bg-pink-400",
  },
};

function getCategoryStyle(category: string) {
  return (
    CATEGORY_COLORS[category] || {
      bg: "bg-secondary",
      text: "text-foreground/70",
      dot: "bg-muted-foreground",
    }
  );
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function IdeaCard({
  idea,
  onToggleFavorite,
  onDelete,
  animDelay = 0,
}: IdeaCardProps) {
  const [starAnim, setStarAnim] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const catStyle = getCategoryStyle(idea.category);

  const handleToggleFavorite = () => {
    setStarAnim(true);
    setTimeout(() => setStarAnim(false), 300);
    onToggleFavorite(idea.id);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(idea.id), 250);
  };

  return (
    <article
      className={`
        group relative flex flex-col bg-card rounded-2xl border border-border/60
        shadow-card hover:shadow-card-hover transition-all duration-300
        hover:-translate-y-1 cursor-default overflow-hidden
        fade-up
        ${idea.isFavorite ? "ring-1 ring-accent/40 shadow-amber" : ""}
        ${isDeleting ? "scale-95 opacity-0 transition-all duration-250" : ""}
      `}
      style={{ animationDelay: `${animDelay}ms`, animationFillMode: "both" }}
    >
      {/* Favorite glow bar */}
      {idea.isFavorite && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent/0 via-accent to-accent/0" />
      )}

      {/* Card body */}
      <div className="flex-1 p-5">
        {/* Top row: category + actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${catStyle.bg} ${catStyle.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
            {idea.category}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {/* Star */}
            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-label={idea.isFavorite ? "Remove from favorites" : "Add to favorites"}
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center transition-all
                ${idea.isFavorite
                  ? "text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/30"
                  : "text-muted-foreground hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                }
              `}
            >
              <Star
                className={`w-4 h-4 transition-all ${starAnim ? "star-pulse" : ""}`}
                fill={idea.isFavorite ? "currentColor" : "none"}
              />
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Delete idea"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg text-card-foreground leading-snug mb-2 line-clamp-2">
          {idea.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-body">
          {idea.description}
        </p>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border/40 bg-secondary/30 flex items-center justify-between">
        <time className="text-xs text-muted-foreground font-mono">
          {formatDate(idea.createdAt)}
        </time>

        {idea.isFavorite && (
          <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
            <Star className="w-3 h-3" fill="currentColor" />
            Favorite
          </span>
        )}
      </div>
    </article>
  );
}
