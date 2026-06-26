import React, { useState } from 'react';
import { Document } from '../utils/apiService';
import { getFileIcon, getFileName } from '../utils/getFileInfo';
import './DocumentPanel.scss'

interface DocumentPanelProps {
  selectedDbFire: string | null; // Corrected type to include null
  documents: Document[];
  isLoading: boolean;
}

const DocumentPanel: React.FC<DocumentPanelProps> = ({ selectedDbFire, documents, isLoading }) => {

  const [expandedDocKey, setExpandedDocKey] = useState<string | null>(null);

  const toggleExpand = (key: string) => {
    setExpandedDocKey(prev => (prev === key ? null : key));
  }

  const renderContent = () => {
    if (isLoading) return <p>Loading documents...</p>;
    if (!selectedDbFire) return <p>Please select a fire from the left panel.</p>;
    if (documents.length === 0) return <p>No documents found for this fire.</p>;

    return (
      <ul className="document-list">
        {documents.map((doc) => {
          const fileicon = getFileIcon(doc.filename);
          const filealias = getFileName(doc.filename);
          const isExpanded = expandedDocKey === doc.key;

          return (
            <li key={doc.key} className='document-item'>
              <div className={`document-row ${isExpanded ? 'expanded' : ''}`} onClick={() => toggleExpand(doc.key)}>
                <div className='file-icon'>
                  <img src={fileicon} alt={`${doc.filename} icon`} className='file-type-img' />
                </div>
                <div className='file-name'>{filealias}</div>
                <a
                  href={doc.url}
                  download
                  target='_blank'
                  rel='noopener noreferrer'
                  className='download-link'
                  onClick={(e) => e.stopPropagation()}
                  title='Download File'
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                </a>
              </div>
              {isExpanded && (
                <div className='document-preview'>
                  <div className='metadata-grid'>
                    <div className='metadata-item full-width'>
                      <span className='metadata-label'>File Name:</span>
                      <span className='metadata-value'>{doc.filename}</span>
                    </div>
                    {doc.size && (
                      <div className='metadata-item full-width'>
                        <span className='metadata-label'>File Size:</span>
                        <span className='metadata-value'>{doc.size}</span>
                      </div>
                    )}
                    {doc.createdDate && (
                      <div className='metadata-item full-width'>
                        <span className='metadata-label'>Generated On:</span>
                        <span className='metadata-value'>{doc.createdDate}</span>
                      </div>
                    )}
  
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return <div className="document-panel">{renderContent()}</div>;
};

export default DocumentPanel;