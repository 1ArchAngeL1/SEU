import React from 'react';

interface ContactLayoutProps {
  children: React.ReactNode;
}

const ContactLayout = ({ children }: ContactLayoutProps) => {
  return (
    <div className="flex flex-col min-h-[calc(100dvh-5rem)] lg:min-h-0 lg:h-[calc(100vh-8rem)] lg:overflow-hidden">
      {children}
    </div>
  );
};

export default ContactLayout;
