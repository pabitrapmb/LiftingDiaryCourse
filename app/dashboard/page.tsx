import { parseISO } from "date-fns";
import { format } from "date-fns";
import { Dumbbell } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "./_components/date-picker";
import { getWorkoutsForDate } from "@/data/workouts";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const selectedDate = date ? parseISO(date) : new Date();
  const workouts = await getWorkoutsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">View your logged workouts</p>
        </div>

        {/* Date Picker */}
        <DatePicker selectedDate={selectedDate} />

        {/* Workout List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Workouts for {format(selectedDate, "do MMM yyyy")}
          </h2>

          {workouts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Dumbbell className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="font-medium">No workouts logged</p>
                <p className="text-sm text-muted-foreground">
                  No workouts were recorded for this day.
                </p>
              </CardContent>
            </Card>
          ) : (
            workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    {workout.name ?? "Unnamed Workout"}
                  </CardTitle>
                  <CardDescription>
                    {format(workout.startedAt, "h:mm a")}
                    {workout.completedAt
                      ? ` – ${format(workout.completedAt, "h:mm a")}`
                      : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {workout.exercises.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No exercises logged
                      </p>
                    ) : (
                      workout.exercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm"
                        >
                          <span className="font-medium">{exercise.name}</span>
                          <span className="text-muted-foreground">
                            {exercise.sets.length}{" "}
                            {exercise.sets.length === 1 ? "set" : "sets"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
export default function Dashboard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Welcome back! You&apos;re logged in.
        </p>
      </main>
    </div>
  );
}
