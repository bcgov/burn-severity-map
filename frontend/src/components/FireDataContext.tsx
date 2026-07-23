import React, { createContext, useState, useEffect, useContext, useMemo, ReactNode, useCallback } from 'react';
import { getFirePoints, getFirePerimeters, getFireNumbers } from '../utils/apiService';

interface FireDataContextType {
    firePointsGeoJSON: any | null;
    firePolysGeoJSON: any | null;
    isLoadingFires: boolean;
    selectedYear: string;
    setSelectedYear: (year: string) => void;
    refetchFires: () => Promise<void>
}

const FireDataContext = createContext<FireDataContextType | undefined>(undefined);

export const FireDataProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: React.ReactNode }) => {
    const [selectedYear, setSelectedYear] = useState<string>(String(new Date().getFullYear()));
    const [rawPointsGeoJSON, setRawPointsGeoJSON] = useState<any | null>(null);
    const [firePolysGeoJSON, setFirePolysGeoJSON] = useState<any | null>(null);
    const [processedFireNumbers, setProcessedFireNumbers] = useState<Set<string>>(new Set());
    const [isLoadingFires, setIsLoadingFires] = useState<boolean>(true);


    const fetchAllFireData = useCallback(async () => {
        setIsLoadingFires(true)
        try {
            const [pointData, polyData, processedData] = await Promise.all([
                getFirePoints({ year: selectedYear }),
                getFirePerimeters({ year: selectedYear, min_hectares: 10 }),
                getFireNumbers(selectedYear).catch(() => ({ fire_numbers: [] }))
            ]);
            setRawPointsGeoJSON(pointData);
            setFirePolysGeoJSON(polyData);
            if (processedData && Array.isArray(processedData.fire_numbers)) {
                setProcessedFireNumbers(new Set(processedData.fire_numbers.map((n: string) => n.trim())));
            } else {
                setProcessedFireNumbers(new Set());
            }
        } catch (error) {
            console.error(`Error loading fires into context for year ${selectedYear}:`, error);
        } finally {
            setIsLoadingFires(false);
        }
    }, [selectedYear]);

    useEffect(() => {
        fetchAllFireData();
    }, [fetchAllFireData]);

    const firePointsGeoJSON = useMemo(() => {
        if (!rawPointsGeoJSON || !firePolysGeoJSON) return null;

        const activePerimeterNumbers = new Set(
            (firePolysGeoJSON.features || [])
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
            const fireId = num ? String(num).trim() : '';
            if (fireId && activePerimeterNumbers.has(fireId)) {
                feature.properties = {
                    ...feature.properties,
                    is_processed: processedFireNumbers.has(fireId)
                };
                return true;
            }
            return false;
        });
        return { ...rawPointsGeoJSON, features: filteredFeatures };
    }, [rawPointsGeoJSON, firePolysGeoJSON, processedFireNumbers]);

    return (
        <FireDataContext.Provider value={{ firePointsGeoJSON, firePolysGeoJSON, isLoadingFires, selectedYear, setSelectedYear, refetchFires: fetchAllFireData }}>
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