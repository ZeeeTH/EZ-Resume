'use client'

import React from 'react'
import { ContactModalProvider } from './ContactModalContext'

export default function AppClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ContactModalProvider>
      {children}
    </ContactModalProvider>
  )
} 