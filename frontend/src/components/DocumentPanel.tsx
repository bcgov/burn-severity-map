import React from 'react';
import { Document } from '../utils/apiService';

interface DocumentPanelProps {
  selectedDbFire: string | null; // Corrected type to include null
  documents: Document[];
  isLoading: boolean;
}

const DocumentPanel: React.FC<DocumentPanelProps> = ({ selectedDbFire, documents, isLoading }) => {
  
  const renderContent = () => {
    if (isLoading) {
      return <p>Loading documents...</p>;
    }
    if (!selectedDbFire) {
        return <p>Please select a fire from the left panel.</p>
    }
    if (documents.length === 0) {
      return <p>No documents found for this fire.</p>;
    }
    return (
      <ul>
        {documents.map((doc) => ( // Removed index as key, doc.key is better
          <li key={doc.key}>
            <a href={doc.url} target="_blank" rel="noopener noreferrer">
              {doc.filename}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h2>Available Documents</h2>
      {renderContent()}
    </div>
  );
};

export default DocumentPanel;