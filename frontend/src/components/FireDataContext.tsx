import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getLiveFiresGeoJSON } from '../utils/apiService';

interface FireDataContextType {
    fireGeoJSON: any | null;
    isLoadingFires: boolean;
}

const FireDataContext = createContext<FireDataContextType | undefined>(undefined);

export const FireDataProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: React.ReactNode }) => {
    const [fireGeoJSON, setFireGeoJSON] = useState<any | null>(null);
    const [isLoadingFires, setIsLoadingFires] = useState<boolean>(true);

    useEffect(() => {
        const fetchFires = async () => {
            try {
                const data = await getLiveFiresGeoJSON();
                setFireGeoJSON(data);
            } catch (error) {
                console.error('Error loading live fires into context:', error)
            } finally {
                setIsLoadingFires(false);
            }
        };
        fetchFires();
    }, []);

    return (
        <FireDataContext.Provider value={{ fireGeoJSON, isLoadingFires }}>
            {children}
        </FireDataContext.Provider>
    );
};

export const useFireData = () => {
    const context = useContext(FireDataContext);
    if (context === undefined) {
        throw new Error('useFireData must be used within a FireDataProvider');
    }
    return context;
};