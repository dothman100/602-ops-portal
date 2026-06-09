import { BookOpenCheck } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { trainingMaterials } from "@/lib/sample-data";

export default function TrainingPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Training Library</h1>
        <p className="mt-2 text-sm text-ink/60">Categorized training materials with required roles and attached quizzes.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {trainingMaterials.map((material) => (
          <Card key={material.title}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge>{material.category}</Badge>
                <h2 className="mt-3 text-xl font-semibold">{material.title}</h2>
              </div>
              <BookOpenCheck className="h-5 w-5 text-moss" />
            </div>
            <p className="mt-3 text-sm leading-6 text-ink/65">Placeholder lesson page for {material.audience}. Content can become PDFs, videos, checklists, or embedded SOPs later.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="good">{material.audience}</Badge>
              <Badge tone={material.status === "Ready" ? "good" : "warn"}>{material.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
