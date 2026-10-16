import { drivers, penalties, teams, technicalControls } from '@fia/shared/db'
import { asc, eq } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'

const DAY_MS = 24 * 60 * 60 * 1000

type DemoTeam = {
  readonly id: string
  readonly driverId: string | null
  readonly carNumber: number
}

const seedPenalties = async (db: DbExecutor, [t1, t2]: readonly [DemoTeam, DemoTeam]) => {
  await db.insert(penalties).values([
    {
      teamId: t1.id,
      type: 'fine',
      penalty: '50.000 EUR',
      reason: 'Salida insegura en el pit lane durante la sesión de clasificación.',
      issuedAt: new Date(),
    },
    {
      teamId: t2.id,
      driverId: t2.driverId,
      type: 'time_penalty',
      penalty: '5 segundos de recargo',
      reason: 'Exceder reiteradamente los límites de pista (cuatro advertencias previas).',
      issuedAt: new Date(),
    },
  ])
}

const seedControls = async (db: DbExecutor, [t1, t2]: readonly [DemoTeam, DemoTeam]) => {
  const now = Date.now()
  await db.insert(technicalControls).values([
    {
      teamId: t1.id,
      driverId: t1.driverId,
      carNumber: t1.carNumber,
      controlType: 'weight',
      status: 'passed',
      notes: 'Verificación de peso dentro de tolerancia reglamentaria (798 kg).',
      inspectedAt: new Date(now - DAY_MS),
      expiresAt: new Date(now + 7 * DAY_MS),
    },
    {
      teamId: t2.id,
      driverId: t2.driverId,
      carNumber: t2.carNumber,
      controlType: 'dimensions',
      status: 'rejected',
      notes: 'Alerón trasero excede deflexión máxima permitida bajo carga de 1000 N.',
      inspectedAt: new Date(now - DAY_MS),
      expiresAt: new Date(now + 7 * DAY_MS),
    },
  ])
}

const demoTeam = async (db: DbExecutor, teamId: string): Promise<DemoTeam> => {
  const [driver] = await db
    .select({ id: drivers.id, number: drivers.number })
    .from(drivers)
    .where(eq(drivers.teamId, teamId))
    .orderBy(asc(drivers.number))
    .limit(1)
  return { id: teamId, driverId: driver?.id ?? null, carNumber: driver?.number ?? 1 }
}

export const seedDemoSprint2 = async (db: DbExecutor): Promise<void> => {
  const [first, second] = await db
    .select({ id: teams.id })
    .from(teams)
    .orderBy(asc(teams.name))
    .limit(2)
  const alreadySeeded = (await db.select({ id: penalties.id }).from(penalties).limit(1)).length > 0
  if (!first || !second || alreadySeeded) {
    return
  }
  const pair = [await demoTeam(db, first.id), await demoTeam(db, second.id)] as const
  await seedPenalties(db, pair)
  await seedControls(db, pair)
}
