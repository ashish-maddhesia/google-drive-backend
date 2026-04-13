import React, { useState, useEffect } from 'react';
import { 
  Folder as FolderIcon, 
  File as FileIcon, 
  MoreVertical, 
  Download, 
  Trash2, 
  Info,
  ChevronRight,
  Search
} from 'lucide-react';
import API from '../api/axios';

const FileExplorer = ({ currentFolderId, onNavigate }) => {
  const [items, setItems] = useState({ folders: [], files: [] });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchContents();
  }, [currentFolderId]);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const id = currentFolderId || 'root';
      const response = await API.get(`/folders/${id}`);
      setItems(response.data);
    } catch (err) {
      console.error('Error fetching contents:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (id) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      await API.delete(`/files/${id}`);
      fetchContents();
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  const deleteFolder = async (id) => {
    if (!confirm('Are you sure you want to delete this folder?')) return;
    try {
      await API.delete(`/folders/${id}`);
      fetchContents();
    } catch (err) {
      console.error('Error deleting folder:', err);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--muted-foreground)',
          fontSize: '14px'
        }}>
          <span style={{ cursor: 'pointer' }} onClick={() => onNavigate(null)}>My Drive</span>
          <ChevronRight size={16} />
          {currentFolderId ? <span style={{ color: 'var(--foreground)', fontWeight: '500' }}>Folder</span> : <span style={{ color: 'var(--foreground)', fontWeight: '500' }}>Root</span>}
        </div>

        <div style={{
          position: 'relative',
          width: '400px'
        }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
          <input 
            type="text" 
            placeholder="Search in Drive"
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--muted)',
              outline: 'none',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>Loading...</div>
      ) : (
        <>
          {/* Folders Section */}
          {items.folders.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--muted-foreground)' }}>Folders</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {items.folders.map(folder => (
                  <div 
                    key={folder._id}
                    onDoubleClick={() => onNavigate(folder._id)}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <FolderIcon size={24} fill="#5f6368" color="#5f6368" />
                    <span style={{ fontSize: '14px', fontWeight: '500', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {folder.name}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); deleteFolder(folder._id); }} style={{ color: 'var(--muted-foreground)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files Section */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--muted-foreground)' }}>Files</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px'
            }}>
              {items.files.map(file => (
                <div 
                  key={file._id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{
                    height: '140px',
                    backgroundColor: 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {file.mimetype.startsWith('image/') ? (
                      <img 
                        src={`http://localhost:3000/${file.path}`} 
                        alt={file.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.parentElement.innerHTML = '<div style="color: var(--muted-foreground)"><FileIcon size={48} /></div>'; }}
                      />
                    ) : (
                      <FileIcon size={48} color="var(--muted-foreground)" />
                    )}
                  </div>
                  <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
                      <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{formatSize(file.size)}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => deleteFile(file._id)} style={{ color: 'var(--muted-foreground)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FileExplorer;
