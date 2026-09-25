import type { ConstraintErrorMap } from '../../core/errors/constraint-violations'

export const STAFF_CONSTRAINT_ERRORS: ConstraintErrorMap = {
  team_staff_file_number_unique: 'STAFF_FILE_NUMBER_ALREADY_EXISTS',
  team_staff_user_id_unique: 'USER_ALREADY_EXISTS',
  team_staff_team_id_teams_id_fk: 'TEAM_NOT_FOUND',
  team_staff_first_name_not_blank: 'VALIDATION_FAILED',
  team_staff_last_name_not_blank: 'VALIDATION_FAILED',
  team_staff_role_in_team_length: 'VALIDATION_FAILED',
  team_staff_phone_number_format: 'VALIDATION_FAILED',
  team_staff_file_number_format: 'VALIDATION_FAILED',
  team_staff_deactivation_consistency: 'VALIDATION_FAILED',
  team_staff_version_positive: 'VALIDATION_FAILED',
  team_staff_updated_after_created: 'VALIDATION_FAILED',
}
