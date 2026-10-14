import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { ChatSection } from '@/features/chat/components/chat-section'

const ChatPage = (): ReactNode => <ChatSection />

export const Route = createFileRoute('/chat')({ component: ChatPage })
