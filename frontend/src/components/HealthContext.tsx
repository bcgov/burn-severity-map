import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchHealth, HealthResponse } from '../utils/apiService';

interface HealthContextType {
    health: HealthResponse | null;
    loading: boolean;
    // Allow for refreshing the health check at any point
    refreshHealth: () => Promise<void>; 
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: React.ReactNode }) => {
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const loadHealth = async () => {
        setLoading(true);
        try {
            const data = await fetchHealth();
            setHealth(data);
        } catch (error) {
            setHealth({
                status: 'unreachable',
                object_storage: 'unreachable',
                data_status: 'unreachable',
                fire_count: null,
                analysis_backend: 'unreachable',
                version: 'dev'
            });
        } finally {
            setLoading(false);
        }
    };

    // Get the health when the provider is mounted
    useEffect(() => {
        loadHealth();
    }, []);

    return (
        <HealthContext.Provider value={{ health, loading, refreshHealth: loadHealth }}>
            {children}
        </HealthContext.Provider>
    );
};

export const useHealth = () => {
    const context = useContext(HealthContext);
    if (context === undefined) {
        throw new Error('useHealth must be used within a HealthProvider');
    }
    return context;
};
