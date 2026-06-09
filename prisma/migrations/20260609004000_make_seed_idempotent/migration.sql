DELETE FROM "ScheduleShift" a
USING "ScheduleShift" b
WHERE a."id" > b."id"
  AND a."employeeId" = b."employeeId"
  AND a."startsAt" = b."startsAt"
  AND a."position" = b."position";

CREATE UNIQUE INDEX "ScheduleShift_employeeId_startsAt_position_key" ON "ScheduleShift"("employeeId", "startsAt", "position");
