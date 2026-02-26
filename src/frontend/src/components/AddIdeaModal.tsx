import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";

const SUGGESTED_CATEGORIES = [
  "Technology",
  "Business",
  "Art & Design",
  "Science",
  "Health",
  "Education",
  "Travel",
  "Food",
  "Finance",
  "Personal",
];

interface AddIdeaModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    category: string;
  }) => Promise<void>;
}

export function AddIdeaModal({ open, onClose, onSubmit }: AddIdeaModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string; category?: string }>({});
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => titleRef.current?.focus(), 100);
    } else {
      setTitle("");
      setDescription("");
      setCategory("");
      setErrors({});
    }
  }, [open]);

  const filteredSuggestions = SUGGESTED_CATEGORIES.filter(
    (c) => c.toLowerCase().includes(category.toLowerCase()) && c !== category
  );

  const validate = () => {
    const e: typeof errors = {};
    if (!title.trim()) e.title = "Title is required";
    if (!description.trim()) e.description = "Description is required";
    if (!category.trim()) e.category = "Category is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsPending(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), category: category.trim() });
      onClose();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-2xl border-border/60 shadow-2xl">
        {/* Amber header strip */}
        <div className="bg-accent/10 px-7 py-5 border-b border-border/50">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-foreground/70" />
              </div>
              <DialogTitle className="font-display text-2xl text-foreground">
                New Idea
              </DialogTitle>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="idea-title" className="text-sm font-medium text-foreground/80">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="idea-title"
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your idea?"
              className={`h-11 text-base bg-background/60 border-border/70 focus:ring-accent/50 focus:border-accent/50 transition-all ${
                errors.title ? "border-destructive" : ""
              }`}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="idea-description" className="text-sm font-medium text-foreground/80">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="idea-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your idea in detail..."
              rows={4}
              className={`text-base bg-background/60 border-border/70 focus:ring-accent/50 focus:border-accent/50 resize-none transition-all ${
                errors.description ? "border-destructive" : ""
              }`}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2 relative">
            <Label htmlFor="idea-category" className="text-sm font-medium text-foreground/80">
              Category <span className="text-destructive">*</span>
            </Label>
            <Input
              id="idea-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="e.g. Technology, Art, Business..."
              className={`h-11 text-base bg-background/60 border-border/70 focus:ring-accent/50 focus:border-accent/50 transition-all ${
                errors.category ? "border-destructive" : ""
              }`}
            />
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category}</p>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-popover border border-border rounded-xl shadow-lg overflow-hidden">
                {filteredSuggestions.slice(0, 5).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setCategory(suggestion);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent/10 transition-colors text-foreground/80 hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 h-11 border-border/70 text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-11 bg-accent text-accent-foreground hover:bg-accent/90 font-medium shadow-amber transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Save Idea
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
