import React from 'react';
import { Document } from '../utils/apiService';
import { getFileType } from '../utils/getFileType';
import './DocumentPanel.scss'

interface DocumentPanelProps {
  selectedDbFire: string | null; // Corrected type to include null
  documents: Document[];
  isLoading: boolean;
}

const DocumentPanel: React.FC<DocumentPanelProps> = ({ selectedDbFire, documents, isLoading }) => {

  const renderContent = () => {
    if (isLoading) return <p>Loading documents...</p>;
    if (!selectedDbFire) return <p>Please select a fire from the left panel.</p>;
    if (documents.length === 0) return <p>No documents found for this fire.</p>;

    return (
      <ul className="document-list">
        {documents.map((doc) => {
          const filetype = getFileType(doc.filename);

          return (
            <li key={doc.key}>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                title={doc.filename} // shows full filename on hover
                className="document-link"
              >
                <span className="file-type">{filetype}</span>
                <span className="file-name">{doc.filename}</span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

  return <div className="document-panel">{renderContent()}</div>;
};

export default DocumentPanel;