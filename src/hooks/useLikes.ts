import { useState, useEffect } from 'react';
import { incrementLike, decrementLike, getComponentLikes } from '@/lib/likes-service';

const STORAGE_KEY = 'component-likes';

export function useLikes() {
    const [likes, setLikes] = useState<Record<string, boolean>>({});
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
    const [mounted, setMounted] = useState(false);

    // Set mounted on client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Load likes from localStorage on mount
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

    // Save likes to localStorage whenever they change
    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(likes));
    }, [likes, mounted]);

    // Fetch like count for a component
    const fetchLikeCount = async (componentId: string) => {
        const count = await getComponentLikes(componentId);
        setLikeCounts(prev => ({ ...prev, [componentId]: count }));
    };

    const toggleLike = async (componentId: string) => {
        const wasLiked = likes[componentId];

        // Update local state immediately for responsive UI
        setLikes(prev => ({
            ...prev,
            [componentId]: !prev[componentId]
        }));

        // Optimistically update count
        setLikeCounts(prev => ({
            ...prev,
            [componentId]: (prev[componentId] || 0) + (wasLiked ? -1 : 1)
        }));

        // Update Firestore in background
        try {
            if (wasLiked) {
                await decrementLike(componentId);
            } else {
                await incrementLike(componentId);
            }
            // Fetch actual count after update
            await fetchLikeCount(componentId);
        } catch (error) {
            console.error('Failed to update like in Firestore:', error);
            // Revert on error
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

    return { toggleLike, isLiked, getLikeCount, getTotalLikes, fetchLikeCount, likes, mounted };
}
