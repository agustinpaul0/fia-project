import '@testing-library/jest-dom/vitest'
import { configureSpanishValidation } from '@fia/shared/contracts'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

configureSpanishValidation()

afterEach(() => {
  cleanup()
})
