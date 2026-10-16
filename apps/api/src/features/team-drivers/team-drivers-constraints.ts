import type { ConstraintErrorMap } from '../../core/errors/constraint-violations'

export const DRIVER_CONSTRAINT_ERRORS: ConstraintErrorMap = {
  drivers_number_unique: 'CAR_NUMBER_ALREADY_TAKEN',
  drivers_code_unique: 'DRIVER_CODE_ALREADY_TAKEN',
  drivers_code_format: 'VALIDATION_FAILED',
  drivers_number_range: 'VALIDATION_FAILED',
  drivers_role_valid: 'VALIDATION_FAILED',
  drivers_license_length: 'VALIDATION_FAILED',
}
