import { toast } from 'sonner'
import { toUserMessage } from './to-user-message'

export const notifyError = (error: unknown): void => {
  toast.error(toUserMessage(error))
}
