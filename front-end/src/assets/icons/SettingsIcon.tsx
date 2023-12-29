import React from 'react';

interface SettingsIconProps {
    width?: number;
    height?: number;
    fill?: string;
}

const SettingsIcon: React.FC<SettingsIconProps> = ({ width = 20, height = 17, fill = 'white' }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M10.7 15.5L10.85 16.225C10.9 16.4583 11.0127 16.646 11.188 16.788C11.3633 16.93 11.5673 17.0007 11.8 17H12.2C12.4333 17 12.6377 16.925 12.813 16.775C12.9883 16.625 13.1007 16.4333 13.15 16.2L13.3 15.5C13.5 15.4167 13.6877 15.329 13.863 15.237C14.0383 15.145 14.2173 15.0327 14.4 14.9L15.125 15.125C15.3417 15.1917 15.5543 15.1833 15.763 15.1C15.9717 15.0167 16.134 14.8833 16.25 14.7L16.45 14.35C16.5667 14.15 16.6083 13.9333 16.575 13.7C16.5417 13.4667 16.4333 13.275 16.25 13.125L15.7 12.65C15.7333 12.4167 15.75 12.2 15.75 12C15.75 11.8 15.7333 11.5833 15.7 11.35L16.25 10.875C16.4333 10.725 16.5417 10.5373 16.575 10.312C16.6083 10.0867 16.5667 9.87434 16.45 9.675L16.225 9.3C16.1083 9.11667 15.95 8.98334 15.75 8.9C15.55 8.81667 15.3417 8.80834 15.125 8.875L14.4 9.1C14.2167 8.96667 14.0373 8.854 13.862 8.762C13.6867 8.67 13.4993 8.58267 13.3 8.5L13.15 7.775C13.1 7.54167 12.9873 7.354 12.812 7.212C12.6367 7.07 12.4327 6.99934 12.2 7H11.8C11.5667 7 11.3623 7.075 11.187 7.225C11.0117 7.375 10.8993 7.56667 10.85 7.8L10.7 8.5C10.5 8.58334 10.3127 8.671 10.138 8.763C9.96333 8.855 9.784 8.96734 9.6 9.1L8.875 8.875C8.65834 8.80834 8.446 8.81667 8.238 8.9C8.03 8.98334 7.86734 9.11667 7.75 9.3L7.55 9.65C7.43334 9.85 7.39167 10.0667 7.425 10.3C7.45834 10.5333 7.56667 10.725 7.75 10.875L8.3 11.35C8.26667 11.5833 8.25 11.8 8.25 12C8.25 12.2 8.26667 12.4167 8.3 12.65L7.75 13.125C7.56667 13.275 7.45834 13.4627 7.425 13.688C7.39167 13.9133 7.43334 14.1257 7.55 14.325L7.775 14.7C7.89167 14.8833 8.05 15.0167 8.25 15.1C8.45 15.1833 8.65834 15.1917 8.875 15.125L9.6 14.9C9.78334 15.0333 9.96234 15.146 10.137 15.238C10.3117 15.33 10.4993 15.4173 10.7 15.5ZM12 14C11.45 14 10.9793 13.804 10.588 13.412C10.1967 13.02 10.0007 12.5493 10 12C10 11.45 10.196 10.979 10.588 10.587C10.98 10.195 11.4507 9.99934 12 10C12.55 10 13.021 10.196 13.413 10.588C13.805 10.98 14.0007 11.4507 14 12C14 12.55 13.804 13.021 13.412 13.413C13.02 13.805 12.5493 14.0007 12 14ZM5 21C4.45 21 3.979 20.804 3.587 20.412C3.195 20.02 2.99934 19.5493 3 19V5C3 4.45 3.196 3.979 3.588 3.587C3.98 3.195 4.45067 2.99934 5 3H19C19.55 3 20.021 3.196 20.413 3.588C20.805 3.98 21.0007 4.45067 21 5V19C21 19.55 20.804 20.021 20.412 20.413C20.02 20.805 19.5493 21.0007 19 21H5ZM5 19H19V5H5V19Z" fill="#1A1A1A" />
        </svg>
    );
};

export default SettingsIcon;
