import React, { createContext, useState, useContext } from 'react';

// Define the Contact context
const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
    const [contact, setContact] = useState({
        username: '',
        mediumOrder: ['Music', 'Books', 'Podcast', 'Shows', 'Movies', 'Hobbies', 'Games'],
        notificationsOn: false,
        theme: 'dark'
    });

    // Function to update the contact details
    const updateContact = (updates) => {
        setContact(currentContact => ({ ...currentContact, ...updates }));
    };

    return (
        <ContactContext.Provider value={{ contact, updateContact }}>
            {children}
        </ContactContext.Provider>
    );
};

export { ContactContext };