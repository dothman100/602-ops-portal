import { Trophy } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { quizzes } from "@/lib/sample-data";

export default function QuizzesPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Quiz and Training Tests</h1>
        <p className="mt-2 text-sm text-ink/60">Prototype quiz list for reviewing training workflow and scoring layout.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.title}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{quiz.title}</h2>
                <p className="mt-2 text-sm text-ink/60">Future quiz builder and employee completion tracking.</p>
              </div>
              <Trophy className="h-5 w-5 text-moss" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-cream p-3">
                <p className="text-lg font-semibold">{quiz.questions}</p>
                <p className="text-xs text-ink/50">Questions</p>
              </div>
              <div className="rounded-md bg-cream p-3">
                <p className="text-lg font-semibold">{quiz.passing}</p>
                <p className="text-xs text-ink/50">Passing</p>
              </div>
              <div className="rounded-md bg-cream p-3">
                <p className="text-lg font-semibold">{quiz.attempts}</p>
                <p className="text-xs text-ink/50">Attempts</p>
              </div>
            </div>
            <div className="mt-4">
              <Badge tone="warn">Placeholder</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
