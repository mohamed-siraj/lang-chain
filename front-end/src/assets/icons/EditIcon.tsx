import React from 'react';

interface EditIconProps {
  width?: number;
  height?: number;
  fill?: string;
}

const EditIcon: React.FC<EditIconProps> = ({ width = 20, height = 17, fill = 'white' }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 19V15.6944L15.2667 5.44722C15.4222 5.30463 15.5941 5.19444 15.7823 5.11667C15.9706 5.03889 16.1681 5 16.375 5C16.5824 5 16.7833 5.03889 16.9778 5.11667C17.1722 5.19444 17.3407 5.31111 17.4833 5.46667L18.5528 6.55556C18.7083 6.69815 18.8219 6.86667 18.8934 7.06111C18.965 7.25556 19.0005 7.45 19 7.64444C19 7.85185 18.9642 8.04967 18.8927 8.23789C18.8211 8.42611 18.7078 8.59774 18.5528 8.75278L8.30555 19H5ZM16.3556 8.73333L17.4444 7.64444L16.3556 6.55556L15.2667 7.64444L16.3556 8.73333Z" fill="#1A1A1A"/>
    </svg>
  );
};

export default EditIcon;