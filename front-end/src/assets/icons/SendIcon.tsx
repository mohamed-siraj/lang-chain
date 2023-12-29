import React from 'react';

interface SendIconProps {
    width?: number;
    height?: number;
    fill?: string;
}

const SendIcon: React.FC<SendIconProps> = ({ width = 20, height = 17, fill = 'white' }) => {
    return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="44" height="44" rx="22" fill="#1A1A1A" />
            <path d="M29.8 22.925L14.4 29.425C14.0667 29.5583 13.75 29.529 13.45 29.337C13.15 29.145 13 28.866 13 28.5V15.5C13 15.1333 13.15 14.854 13.45 14.662C13.75 14.47 14.0667 14.441 14.4 14.575L29.8 21.075C30.2167 21.2583 30.425 21.5667 30.425 22C30.425 22.4333 30.2167 22.7417 29.8 22.925ZM15 27L26.85 22L15 17V20.5L21 22L15 23.5V27Z" fill="white" />
        </svg>
    );
};

export default SendIcon;