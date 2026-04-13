import React from 'react';
import { Search, Bell, Settings, HelpCircle, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav style={{
      height: '64px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      backgroundColor: 'var(--background)'
    }}>
      <div style={{ flex: 1 }}></div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        color: 'var(--muted-foreground)'
      }}>
        <HelpCircle size={20} style={{ cursor: 'pointer' }} />
        <Bell size={20} style={{ cursor: 'pointer' }} />
        <Settings size={20} style={{ cursor: 'pointer' }} />
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--secondary-foreground)',
          cursor: 'pointer'
        }}>
          <User size={18} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
