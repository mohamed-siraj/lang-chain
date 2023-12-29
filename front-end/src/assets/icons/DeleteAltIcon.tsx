import React from 'react';

interface DeleteAltIconProps {
    width?: number;
    height?: number;
    fill?: string;
}

const DeleteAltIcon: React.FC<DeleteAltIconProps> = ({ width = 20, height = 17, fill = 'white' }) => {
    return (
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 18C2.45 18 1.979 17.804 1.587 17.412C1.195 17.02 0.999337 16.5493 1 16V3C0.71667 3 0.479004 2.904 0.287004 2.712C0.0950036 2.52 -0.000663206 2.28267 3.4602e-06 2C3.4602e-06 1.71667 0.0960036 1.479 0.288004 1.287C0.480004 1.095 0.717337 0.999337 1 1H5C5 0.71667 5.096 0.479003 5.288 0.287003C5.48 0.0950034 5.71734 -0.000663206 6 3.46021e-06H10C10.2833 3.46021e-06 10.521 0.0960036 10.713 0.288004C10.905 0.480004 11.0007 0.717337 11 1H15C15.2833 1 15.521 1.096 15.713 1.288C15.905 1.48 16.0007 1.71734 16 2C16 2.28334 15.904 2.521 15.712 2.713C15.52 2.905 15.2827 3.00067 15 3V16C15 16.55 14.804 17.021 14.412 17.413C14.02 17.805 13.5493 18.0007 13 18H3ZM13 3H3V16H13V3ZM6 14C6.28334 14 6.521 13.904 6.713 13.712C6.905 13.52 7.00067 13.2827 7 13V6C7 5.71667 6.904 5.479 6.712 5.287C6.52 5.095 6.28267 4.99934 6 5C5.71667 5 5.479 5.096 5.287 5.288C5.095 5.48 4.99934 5.71734 5 6V13C5 13.2833 5.096 13.521 5.288 13.713C5.48 13.905 5.71734 14.0007 6 14ZM10 14C10.2833 14 10.521 13.904 10.713 13.712C10.905 13.52 11.0007 13.2827 11 13V6C11 5.71667 10.904 5.479 10.712 5.287C10.52 5.095 10.2827 4.99934 10 5C9.71667 5 9.479 5.096 9.287 5.288C9.095 5.48 8.99934 5.71734 9 6V13C9 13.2833 9.096 13.521 9.288 13.713C9.48 13.905 9.71734 14.0007 10 14Z" fill="#FF6464"/>
        </svg>
    );
};

export default DeleteAltIcon;