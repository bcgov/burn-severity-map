import React, { createContext, useState, useEffect, useContext, useMemo, ReactNode } from 'react';
import { getLivePointsGeoJSON, getLivePerimetersGeoJSON } from '../utils/apiService';

interface FireDataContextType {
    firePointsGeoJSON: any | null;
    firePolysGeoJSON: any | null;
    isLoadingFires: boolean;
}

const FireDataContext = createContext<FireDataContextType | undefined>(undefined);

export const FireDataProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: React.ReactNode }) => {
    const [rawPointsGeoJSON, setRawPointsGeoJSON] = useState<any | null>(null);
    const [firePolysGeoJSON, setFirePolysGeoJSON] = useState<any | null>(null);
    const [isLoadingFires, setIsLoadingFires] = useState<boolean>(true);

    useEffect(() => {
        const fetchAllFireData = async () => {
            try {
                const [pointData, polyData] = await Promise.all([
                    getLivePointsGeoJSON(),
                    getLivePerimetersGeoJSON()
                ]);
                setRawPointsGeoJSON(pointData);
                setFirePolysGeoJSON(polyData);
            } catch (error) {
                console.error('Error loading fires into context:', error);
            } finally {
                setIsLoadingFires(false);
            }
        };
        fetchAllFireData();
    }, []);

    const firePointsGeoJSON = useMemo(() => {
        if (!rawPointsGeoJSON || !firePolysGeoJSON) return null;

        const activePerimeterNumbers = new Set(
            firePolysGeoJSON.features
                .map((feature: any) => {
                    const props = feature.properties || {};
                    const num = props.FIRE_NUMBER || props.fire_number;
                    return num ? String(num).trim() : null;
                })
                .filter(Boolean)
        );

        const filteredFeatures = rawPointsGeoJSON.features.filter((feature: any) => {
            const props = feature.properties || {};
            const num = props.FIRE_NUMBER || props.fire_number;
            return num && activePerimeterNumbers.has(String(num).trim());
        });
        return { ...rawPointsGeoJSON, features: filteredFeatures };
    }, [rawPointsGeoJSON, firePolysGeoJSON]);

    return (
        <FireDataContext.Provider value={{ firePointsGeoJSON, firePolysGeoJSON, isLoadingFires }}>
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