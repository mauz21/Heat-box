import { Flame } from "lucide-react";

interface SpicyLevelProps {
  level: number;
}

export function SpicyLevel({ level }: SpicyLevelProps) {
  if (level === 0) return null;

  return (
    <div className="flex items-center gap-0.5" title={`Spiciness: ${level}/3`}>
      {[...Array(3)].map((_, i) => (
        <Flame
          key={i}
          className={`w-4 h-4 ${
            i < level ? "text-primary fill-primary" : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}
