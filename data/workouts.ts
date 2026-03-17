import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/db";
import { workouts, workoutExercises, exercises, sets } from "@/src/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

export async function getWorkoutsForDate(date: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      workoutStartedAt: workouts.startedAt,
      workoutCompletedAt: workouts.completedAt,
      workoutExerciseId: workoutExercises.id,
      workoutExerciseOrderIndex: workoutExercises.orderIndex,
      exerciseId: exercises.id,
      exerciseName: exercises.name,
      setId: sets.id,
      setNumber: sets.setNumber,
      setReps: sets.reps,
      setWeightKg: sets.weightKg,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, startOfDay),
        lt(workouts.startedAt, endOfDay),
      ),
    )
    .orderBy(workouts.id, workoutExercises.orderIndex, sets.setNumber);

  // Group flat rows into nested workout → exercise → sets structure
  const workoutMap = new Map<
    number,
    {
      id: number;
      name: string | null;
      startedAt: Date;
      completedAt: Date | null;
      exercises: Map<
        number,
        {
          id: number;
          name: string;
          orderIndex: number;
          sets: {
            id: number;
            setNumber: number;
            reps: number | null;
            weightKg: string | null;
          }[];
        }
      >;
    }
  >();

  for (const row of rows) {
    if (!workoutMap.has(row.workoutId)) {
      workoutMap.set(row.workoutId, {
        id: row.workoutId,
        name: row.workoutName,
        startedAt: row.workoutStartedAt,
        completedAt: row.workoutCompletedAt,
        exercises: new Map(),
      });
    }

    const workout = workoutMap.get(row.workoutId)!;

    if (
      row.workoutExerciseId !== null &&
      row.exerciseId !== null &&
      row.exerciseName !== null
    ) {
      if (!workout.exercises.has(row.workoutExerciseId)) {
        workout.exercises.set(row.workoutExerciseId, {
          id: row.workoutExerciseId,
          name: row.exerciseName,
          orderIndex: row.workoutExerciseOrderIndex!,
          sets: [],
        });
      }

      const exercise = workout.exercises.get(row.workoutExerciseId)!;

      if (row.setId !== null) {
        exercise.sets.push({
          id: row.setId,
          setNumber: row.setNumber!,
          reps: row.setReps,
          weightKg: row.setWeightKg,
        });
      }
    }
  }

  return Array.from(workoutMap.values()).map((w) => ({
    ...w,
    exercises: Array.from(w.exercises.values()),
  }));
}
