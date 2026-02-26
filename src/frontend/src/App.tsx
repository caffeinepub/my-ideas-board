import { useState, useMemo } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Sparkles,
  Star,
  Lightbulb,
  Heart,
} from "lucide-react";
import { IdeaCard } from "./components/IdeaCard";
import { AddIdeaModal } from "./components/AddIdeaModal";
import {
  useGetAllIdeas,
  useCreateIdea,
  useDeleteIdea,
  useToggleFavorite,
} from "./hooks/useQueries";

const ALL_FILTER = "All";
const FAVORITES_FILTER = "★ Favorites";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_FILTER);

  const { data: ideas = [], isLoading } = useGetAllIdeas();
  const createIdea = useCreateIdea();
  const deleteIdea = useDeleteIdea();
  const toggleFavorite = useToggleFavorite();

  // Derive unique categories from ideas
  const categories = useMemo(() => {
    const cats = Array.from(new Set(ideas.map((i) => i.category))).sort();
    return [ALL_FILTER, FAVORITES_FILTER, ...cats];
  }, [ideas]);

  // Filtered ideas
  const filteredIdeas = useMemo(() => {
    let result = [...ideas];

    if (activeCategory === FAVORITES_FILTER) {
      result = result.filter((i) => i.isFavorite);
    } else if (activeCategory !== ALL_FILTER) {
      result = result.filter((i) => i.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }

    // Sort: favorites first, then by creation date desc
    return result.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return Number(b.createdAt - a.createdAt);
    });
  }, [ideas, activeCategory, search]);

  const handleCreateIdea = async (data: {
    title: string;
    description: string;
    category: string;
  }) => {
    await createIdea.mutateAsync(data);
    toast.success("Idea saved!", {
      description: `"${data.title}" added to your board.`,
    });
  };

  const handleDeleteIdea = (id: bigint) => {
    deleteIdea.mutate(id, {
      onSuccess: () => toast.success("Idea deleted"),
      onError: () => toast.error("Failed to delete idea"),
    });
  };

  const handleToggleFavorite = (id: bigint) => {
    toggleFavorite.mutate(id, {
      onError: () => toast.error("Failed to update favorite"),
    });
  };

  const favoritesCount = ideas.filter((i) => i.isFavorite).length;

  return (
    <div className="min-h-screen bg-background grain">
      <Toaster position="bottom-right" richColors />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo + wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="font-display text-xl leading-none text-foreground">
                IdeaBoard
              </h1>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5 font-body">
                your personal idea journal
              </p>
            </div>
          </div>

          {/* Stats + CTA */}
          <div className="flex items-center gap-3">
            {favoritesCount > 0 && (
              <span className="hidden sm:flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-full">
                <Star className="w-3.5 h-3.5" fill="currentColor" />
                {favoritesCount} {favoritesCount === 1 ? "favorite" : "favorites"}
              </span>
            )}
            <Button
              onClick={() => setModalOpen(true)}
              className="h-9 px-4 bg-accent text-accent-foreground hover:bg-accent/90 font-medium rounded-xl shadow-amber gap-2 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>New Idea</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Hero text (only when ideas exist) */}
        {ideas.length > 0 && (
          <div className="fade-up">
            <p className="text-muted-foreground text-sm font-body">
              {ideas.length} {ideas.length === 1 ? "idea" : "ideas"} captured
            </p>
          </div>
        )}

        {/* Search + Filters row */}
        <div className="space-y-4 fade-up" style={{ animationDelay: "60ms" }}>
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your ideas..."
              className="pl-10 h-10 bg-card border-border/60 rounded-xl focus:ring-accent/40 focus:border-accent/40 font-body"
            />
          </div>

          {/* Category filters */}
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                    ${
                      activeCategory === cat
                        ? "bg-accent text-accent-foreground shadow-amber"
                        : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-accent/40"
                    }
                    ${cat === FAVORITES_FILTER ? "flex items-center gap-1" : ""}
                  `}
                >
                  {cat === FAVORITES_FILTER && (
                    <Star className="w-3 h-3" fill={activeCategory === cat ? "currentColor" : "none"} />
                  )}
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Cards Grid ── */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredIdeas.length > 0 ? (
          <section
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            aria-label="Ideas grid"
          >
            {filteredIdeas.map((idea, i) => (
              <IdeaCard
                key={idea.id.toString()}
                idea={idea}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDeleteIdea}
                animDelay={i * 50}
              />
            ))}
          </section>
        ) : ideas.length === 0 ? (
          <EmptyState onAddIdea={() => setModalOpen(true)} />
        ) : (
          <NoResultsState
            search={search}
            category={activeCategory}
            onReset={() => {
              setSearch("");
              setActiveCategory(ALL_FILTER);
            }}
          />
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="mt-16 border-t border-border/40 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-center text-sm text-muted-foreground gap-1">
          <span>© 2026. Built with</span>
          <Heart className="w-4 h-4 text-accent fill-accent mx-0.5" />
          <span>using</span>
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </footer>

      {/* ── Modal ── */}
      <AddIdeaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateIdea}
      />
    </div>
  );
}

/* ── Loading Skeleton ── */
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {(["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"] as const).map((key) => (
        <div
          key={key}
          className="bg-card rounded-2xl border border-border/60 p-5 space-y-3"
        >
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

/* ── Empty State ── */
function EmptyState({ onAddIdea }: { onAddIdea: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center fade-up">
      <div className="relative mb-6">
        <img
          src="/assets/generated/empty-ideas-transparent.dim_240x240.png"
          alt="No ideas yet"
          className="w-32 h-32 object-contain opacity-90"
        />
        <div className="absolute -inset-4 bg-accent/5 rounded-full blur-2xl" />
      </div>

      <h2 className="font-display text-2xl text-foreground mb-2">
        Your idea board awaits
      </h2>
      <p className="text-muted-foreground text-sm max-w-xs leading-relaxed font-body mb-6">
        Every big thing started as a small thought. Capture your first idea
        before it slips away.
      </p>
      <Button
        onClick={onAddIdea}
        className="h-10 px-6 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl font-medium shadow-amber gap-2 hover:scale-105 transition-all"
      >
        <Sparkles className="w-4 h-4" />
        Capture your first idea
      </Button>
    </div>
  );
}

/* ── No Results State ── */
function NoResultsState({
  search,
  category,
  onReset,
}: {
  search: string;
  category: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center fade-up">
      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <Search className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="font-display text-xl text-foreground mb-1">
        No ideas found
      </h3>
      <p className="text-muted-foreground text-sm font-body mb-4">
        {search
          ? `Nothing matched "${search}"`
          : `No ideas in "${category}" yet`}
      </p>
      <Button
        variant="outline"
        onClick={onReset}
        className="rounded-xl border-border/60 text-muted-foreground hover:text-foreground"
      >
        Clear filters
      </Button>
    </div>
  );
}
