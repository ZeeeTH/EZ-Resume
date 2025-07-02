'use client'

import React from 'react'
import { ContactModalProvider } from './ContactModalContext'
import { AuthProvider } from '../contexts/AuthContext'

export default function AppClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ContactModalProvider>
        {children}
      </ContactModalProvider>
    </AuthProvider>
  )
} 