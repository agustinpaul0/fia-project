import type { ConstraintErrorMap } from '../../core/errors/constraint-violations'

export const PENALTY_CONSTRAINT_ERRORS: ConstraintErrorMap = {
  penalties_team_id_teams_id_fk: 'TEAM_NOT_FOUND',
  penalties_driver_id_drivers_id_fk: 'DRIVER_NOT_FOUND',
  penalties_race_id_races_id_fk: 'RACE_NOT_FOUND',
  penalties_type_valid: 'VALIDATION_FAILED',
  penalties_penalty_length: 'VALIDATION_FAILED',
  penalties_reason_length: 'VALIDATION_FAILED',
}
