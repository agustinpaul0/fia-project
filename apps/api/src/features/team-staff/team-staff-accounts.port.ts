export type CreateAccountInput = {
  readonly email: string
  readonly password: string
  readonly name: string
  readonly role: 'team_staff'
  readonly teamId: string
}

export type UpdateAccountInput = {
  readonly name: string
  readonly teamId: string
}

export type StaffAccountsPort = {
  readonly createAccount: (input: CreateAccountInput) => Promise<{ userId: string }>
  readonly updateAccount: (userId: string, input: UpdateAccountInput) => Promise<void>
  readonly banAccount: (userId: string) => Promise<void>
}
