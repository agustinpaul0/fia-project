export type CreateAccountInput = {
  readonly email: string
  readonly password: string
  readonly name: string
  readonly role: 'team_staff' | 'driver'
  readonly teamId: string | null
}

export type UpdateAccountInput = {
  readonly name: string
  readonly teamId: string | null
}

export type StaffAccountsPort = {
  readonly createAccount: (input: CreateAccountInput) => Promise<{ userId: string }>
  readonly updateAccount: (userId: string, input: UpdateAccountInput) => Promise<void>
  readonly banAccount: (userId: string) => Promise<void>
}
