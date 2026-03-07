import HeaderNew from '@/components/header/HeaderNew';
import React from 'react';

interface ContactLayoutProps {
  children: React.ReactNode;
}

const ContactLayout = ({ children }: ContactLayoutProps) => {
  return (
    <div className={'flex flex-col h-[calc(100vh-10rem)] overflow-hidden'}>
      {/*<HeaderNew />*/}
      {children}
    </div>
  );
};

export default ContactLayout;
