import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <ChatWidget />
      <Footer />
    </>
  );
};

export default PublicLayout;
