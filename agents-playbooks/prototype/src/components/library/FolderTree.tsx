import { Folder as FolderIcon, Star } from 'lucide-react'
import type { Folder } from '../../data/mockData'

interface FolderTreeProps {
  folders: Folder[]
  selectedFolderId: string | null
  onSelectFolder: (id: string) => void
}

export function FolderTree({ folders, selectedFolderId, onSelectFolder }: FolderTreeProps) {
  return (
    <div style={{ padding: '8px 0' }}>
      {/* Favorites */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          fontSize: 13,
          color: '#1D2433',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        <Star size={14} strokeWidth={1.5} color="#6B7A99" />
        Favorites
      </div>

      {/* Flat folder list */}
      {folders.map((folder) => {
        const isSelected = selectedFolderId === folder.id
        return (
          <div
            key={folder.id}
            onClick={() => onSelectFolder(folder.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 16px',
              cursor: 'pointer',
              background: isSelected ? '#EEF2F8' : 'transparent',
              borderRadius: isSelected ? 4 : 0,
              margin: isSelected ? '0 4px' : '0',
              fontSize: 13,
              color: isSelected ? '#1D2433' : '#3A4A6B',
              fontWeight: isSelected ? 500 : 400,
            }}
          >
            <FolderIcon
              size={14}
              strokeWidth={1.5}
              color={isSelected ? '#1D2433' : '#6B7A99'}
              style={{ flexShrink: 0 }}
            />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {folder.name}
            </span>
            {isSelected && (
              <button
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6B7A99',
                  fontSize: 16,
                  padding: 0,
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                ⋯
              </button>
            )}
          </div>
        )
      })}

      {/* Add Folder */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 16px',
          background: 'transparent',
          border: 'none',
          fontSize: 13,
          color: '#6B7A99',
          cursor: 'pointer',
          width: '100%',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
        Add Folder
      </button>
    </div>
  )
}
