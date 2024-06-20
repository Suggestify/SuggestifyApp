import React, { createContext, useState } from 'react';

// Define the Contact context
const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
    const [contact, setContact] = useState({
        username: '',
        mediumOrder: ['Music', 'Books', 'Podcasts', 'Shows', 'Movies', 'Hobbies', 'Games'],
        notificationOn: false,
        theme: false
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