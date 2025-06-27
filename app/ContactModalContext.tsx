"use client"

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ContactModalContextType {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const ContactModalContext = createContext<ContactModalContextType>({
  open: false,
  openModal: () => {},
  closeModal: () => {},
});

export function useContactModal() {
  return useContext(ContactModalContext);
}

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <ContactModalContext.Provider value={{ open, openModal, closeModal }}>
      {children}
    </ContactModalContext.Provider>
  );
} 