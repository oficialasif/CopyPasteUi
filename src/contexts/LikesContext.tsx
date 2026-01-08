'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { incrementLike, decrementLike, getComponentLikes } from '@/lib/likes-service';

const STORAGE_KEY = 'component-likes';

interface LikesContextType {
    likes: Record<string, boolean>;
    likeCounts: Record<string, number>;
    toggleLike: (componentId: string) => Promise<void>;
    isLiked: (componentId: string) => boolean;
    getLikeCount: (componentId: string) => number;
    getTotalLikes: () => number;
    fetchLikeCount: (componentId: string) => Promise<void>;
    mounted: boolean;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

export function LikesProvider({ children }: { children: ReactNode }) {
    const [likes, setLikes] = useState<Record<string, boolean>>({});
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setLikes(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse likes:', e);
            }
        }
    }, [mounted]);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(likes));
    }, [likes, mounted]);

    const fetchLikeCount = async (componentId: string) => {
        const count = await getComponentLikes(componentId);
        setLikeCounts(prev => ({ ...prev, [componentId]: count }));
    };

    const toggleLike = async (componentId: string) => {
        const wasLiked = likes[componentId];

        setLikes(prev => ({
            ...prev,
            [componentId]: !prev[componentId]
        }));

        setLikeCounts(prev => ({
            ...prev,
            [componentId]: (prev[componentId] || 0) + (wasLiked ? -1 : 1)
        }));

        try {
            if (wasLiked) {
                await decrementLike(componentId);
            } else {
                await incrementLike(componentId);
            }
            await fetchLikeCount(componentId);
        } catch (error) {
            console.error('Failed to update like in Firestore:', error);
            setLikes(prev => ({
                ...prev,
                [componentId]: wasLiked
            }));
            setLikeCounts(prev => ({
                ...prev,
                [componentId]: (prev[componentId] || 0) + (wasLiked ? 1 : -1)
            }));
        }
    };

    const isLiked = (componentId: string) => !!likes[componentId];
    const getLikeCount = (componentId: string) => likeCounts[componentId] || 0;
    const getTotalLikes = () => Object.values(likes).filter(Boolean).length;

    return (
        <LikesContext.Provider value={{ likes, likeCounts, toggleLike, isLiked, getLikeCount, getTotalLikes, fetchLikeCount, mounted }}>
            {children}
        </LikesContext.Provider>
    );
}

export function useLikes() {
    const context = useContext(LikesContext);
    if (!context) {
        throw new Error('useLikes must be used within LikesProvider');
    }
    return context;
}
