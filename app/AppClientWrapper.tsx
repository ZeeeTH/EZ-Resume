"use client";
import { ContactModalProvider, useContactModal } from './ContactModalContext';
import ContactModal from './ContactModal';

function ContactModalRoot() {
  const { open, closeModal } = useContactModal();
  return <ContactModal open={open} onClose={closeModal} />;
}

export default function AppClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ContactModalProvider>
      {children}
      <ContactModalRoot />
    </ContactModalProvider>
  );
} 