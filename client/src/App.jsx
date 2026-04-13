import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import FileExplorer from './components/FileExplorer';
import { Plus, Upload, FolderPlus, X } from 'lucide-react';
import API from './api/axios';

import Navbar from './components/Navbar';

function App() {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNavigate = (folderId) => {
    setCurrentFolderId(folderId);
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await API.post('/folders/create', {
        name: newFolderName,
        parentFolder: currentFolderId
      });
      setNewFolderName('');
      setShowFolderModal(false);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('Error creating folder:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    if (currentFolderId) {
      formData.append('parentFolder', currentFolderId);
    }
    formData.append('file', file);

    try {
      await API.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setRefreshKey(prev => prev + 1);
      setShowNewMenu(false);
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--background)' }}>
      <Sidebar />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <Navbar />
        <FileExplorer 
          currentFolderId={currentFolderId} 
          onNavigate={handleNavigate} 
          key={refreshKey + (currentFolderId || 'root')}
        />

        {/* Floating Action Button for Mobile or Quick Menu */}
        <div style={{ position: 'absolute', bottom: '32px', right: '32px' }}>
          {showNewMenu && (
            <div style={{
              position: 'absolute',
              bottom: '70px',
              right: '0',
              backgroundColor: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '8px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              minWidth: '180px',
              zIndex: 10
            }}>
              <button 
                onClick={() => { setShowFolderModal(true); setShowNewMenu(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FolderPlus size={18} /> New Folder
              </button>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                color: 'var(--foreground)',
                fontSize: '14px',
                cursor: 'pointer'
              }}
              className="hover-bg"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Upload size={18} /> Upload File
                <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
              </label>
            </div>
          )}
          <button 
            onClick={() => setShowNewMenu(!showNewMenu)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '28px',
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px 0 rgba(0,0,0,0.39)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {showNewMenu ? <X size={24} /> : <Plus size={24} />}
          </button>
        </div>

        {/* Create Folder Modal */}
        {showFolderModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}>
            <div style={{
              backgroundColor: 'var(--popover)',
              width: '400px',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>New Folder</h2>
              <form onSubmit={handleCreateFolder}>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    fontSize: '14px',
                    marginBottom: '24px',
                    outline: 'none'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button 
                    type="button"
                    onClick={() => setShowFolderModal(false)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--muted-foreground)'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{
                      padding: '8px 24px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;