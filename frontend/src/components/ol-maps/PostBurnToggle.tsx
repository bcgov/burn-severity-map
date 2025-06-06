import React from 'react';

interface PostBurnToggleProps {
  isActive: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const PostBurnToggle: React.FC<PostBurnToggleProps> = ({ isActive, onToggle, disabled }) => (
  <label style={{ display: 'flex', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer' }}>
    <input
      type="checkbox"
      checked={isActive}
      onChange={onToggle}
      disabled={disabled}
      style={{ display: 'none' }}
    />
    <span
      style={{
        width: 36,
        height: 20,
        background: isActive ? '#1976d2' : '#ccc',
        borderRadius: 12,
        position: 'relative',
        transition: 'background 0.2s',
        marginRight: 8,
        display: 'inline-block',
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: isActive ? 18 : 2,
          top: 2,
          width: 16,
          height: 16,
          background: '#fff',
          borderRadius: '50%',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }}
      />
    </span>
  </label>
);

export default PostBurnToggle;
