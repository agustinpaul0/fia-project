import type { ConstraintErrorMap } from '../../core/errors/constraint-violations'

export const TECHNICAL_CONTROL_CONSTRAINT_ERRORS: ConstraintErrorMap = {
  technical_controls_team_id_teams_id_fk: 'TEAM_NOT_FOUND',
  technical_controls_driver_id_drivers_id_fk: 'DRIVER_NOT_FOUND',
  technical_controls_race_id_races_id_fk: 'RACE_NOT_FOUND',
  tech_controls_car_number_range: 'VALIDATION_FAILED',
  tech_controls_type_valid: 'VALIDATION_FAILED',
  tech_controls_status_valid: 'VALIDATION_FAILED',
  tech_controls_expires_after_inspection: 'VALIDATION_FAILED',
}
