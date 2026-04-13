import React from 'react';
import { Home, Folder, HardDrive, Clock, Star, Trash2, Cloud } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', active: true },
    { icon: <HardDrive size={20} />, label: 'My Drive' },
    { icon: <Clock size={20} />, label: 'Recent' },
    { icon: <Star size={20} />, label: 'Starred' },
    { icon: <Trash2 size={20} />, label: 'Trash' },
  ];

  return (
    <aside style={{
      width: '240px',
      height: '100vh',
      borderRight: '1px solid var(--border)',
      padding: '24px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 12px 32px 12px',
        color: 'var(--foreground)',
        fontWeight: '600',
        fontSize: '20px'
      }}>
        <Cloud size={28} color="#3b82f6" fill="#3b82f6" />
        <span>SkyDrive</span>
      </div>

      <button style={{
        backgroundColor: 'var(--primary)',
        color: 'var(--primary-foreground)',
        padding: '12px 24px',
        borderRadius: 'var(--radius)',
        fontWeight: '500',
        marginBottom: '24px',
        width: 'fit-content',
        marginLeft: '12px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '20px' }}>+</span> New
      </button>

      {menuItems.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            backgroundColor: item.active ? 'var(--accent)' : 'transparent',
            color: item.active ? 'var(--foreground)' : 'var(--muted-foreground)',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!item.active) e.currentTarget.style.backgroundColor = 'var(--muted)';
          }}
          onMouseLeave={(e) => {
            if (!item.active) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {item.icon}
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
