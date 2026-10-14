import { penalties, teams, technicalControls } from '@fia/shared/db'
import type { DbExecutor } from '../../core/db/executor'

const seedPenalties = async (db: DbExecutor, t1Id: string, t2Id: string) => {
  await db
    .insert(penalties)
    .values([
      {
        teamId: t1Id,
        type: 'fine',
        penalty: '50.000 EUR',
        reason: 'Salida insegura en el pit lane durante la sesión de clasificación.',
        issuedAt: new Date(),
      },
      {
        teamId: t2Id,
        type: 'time_penalty',
        penalty: '5 segundos de recargo',
        reason: 'Exceder reiteradamente los límites de pista (cuatro advertencias previas).',
        issuedAt: new Date(),
      },
    ])
    .onConflictDoNothing()
}

const seedControls = async (db: DbExecutor, t1Id: string, t2Id: string) => {
  await db
    .insert(technicalControls)
    .values([
      {
        teamId: t1Id,
        controlType: 'weight',
        status: 'passed',
        notes: 'Verificación de peso dentro de tolerancia reglamentaria (798 kg).',
        inspectedAt: new Date(),
      },
      {
        teamId: t2Id,
        controlType: 'dimensions',
        status: 'rejected',
        notes: 'Alerón trasero excede deflexión máxima permitida bajo carga de 1000 N.',
        inspectedAt: new Date(),
      },
    ])
    .onConflictDoNothing()
}

export const seedDemoSprint2 = async (db: DbExecutor): Promise<void> => {
  const allTeams = await db.select({ id: teams.id }).from(teams).limit(2)
  if (allTeams.length < 2) {
    return
  }
  const team1 = allTeams[0]
  const team2 = allTeams[1]
  if (!team1 || !team2) {
    return
  }
  await seedPenalties(db, team1.id, team2.id)
  await seedControls(db, team1.id, team2.id)
}
