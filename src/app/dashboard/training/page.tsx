import { BookOpenCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge, Card } from "@/components/ui";
import { roleLabels } from "@/lib/permissions";

export default async function TrainingPage() {
  const materials = await prisma.trainingMaterial.findMany({
    include: { quiz: { include: { questions: true, attempts: true } } },
    orderBy: { category: "asc" },
  });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Training Library</h1>
        <p className="mt-2 text-sm text-ink/60">Categorized training materials with required roles and attached quizzes.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {materials.map((material) => (
          <Card key={material.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge>{material.category}</Badge>
                <h2 className="mt-3 text-xl font-semibold">{material.title}</h2>
              </div>
              <BookOpenCheck className="h-5 w-5 text-moss" />
            </div>
            <p className="mt-3 text-sm leading-6 text-ink/65">{material.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {material.requiredFor.map((role) => (
                <Badge key={role} tone="good">
                  {roleLabels[role]}
                </Badge>
              ))}
            </div>
            {material.quiz ? (
              <div className="mt-5 rounded-md border border-ink/10 bg-cream p-4">
                <p className="font-semibold">{material.quiz.title}</p>
                <p className="mt-1 text-sm text-ink/55">
                  {material.quiz.questions.length} questions / {material.quiz.passingScore}% passing score / {material.quiz.attempts.length} attempts
                </p>
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
