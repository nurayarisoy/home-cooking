// DataContext.js

import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Kullanıcı bilgilerini depolamak için örnek bir state

    return (
        <DataContext.Provider value={{ user }}>
            {children}
        </DataContext.Provider>
    );
}
