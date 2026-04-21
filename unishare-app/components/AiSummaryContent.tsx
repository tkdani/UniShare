import { RefreshCw, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";

export function AiSummaryContent({
  summary,
  isLoading,
  error,
  onRegenerate,
}: {
  summary: string;
  isLoading: boolean;
  error?: string | null;
  onRegenerate: () => void;
}) {
  if (isLoading && !summary) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative">
          <Sparkles className="size-10 text-primary animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Generating summary...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <Sparkles className="size-4 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-destructive leading-relaxed">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Please check that AI Gateway is properly configured.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          className="w-full gap-2"
        >
          <RefreshCw className="size-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles className="size-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-card-foreground leading-relaxed">
            {summary || "Click to generate an AI summary of this file."}
          </p>
          {isLoading && (
            <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
          )}
        </div>
      </div>

      {summary && !isLoading && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          className="w-full gap-2"
        >
          <RefreshCw className="size-4" />
          Regenerate
        </Button>
      )}
    </div>
  );
}
