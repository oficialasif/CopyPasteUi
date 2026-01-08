import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";

// Get like count for a component
export const getComponentLikes = async (componentId: string): Promise<number> => {
    try {
        const docRef = doc(db, "component-likes", componentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().count || 0;
        }
        return 0;
    } catch (error) {
        console.error("Error getting likes:", error);
        return 0;
    }
};

// Increment like count for a component
export const incrementLike = async (componentId: string) => {
    try {
        const docRef = doc(db, "component-likes", componentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(docRef, {
                count: increment(1)
            });
        } else {
            await setDoc(docRef, {
                componentId,
                count: 1
            });
        }
    } catch (error) {
        console.error("Error incrementing like:", error);
    }
};

// Decrement like count for a component
export const decrementLike = async (componentId: string) => {
    try {
        const docRef = doc(db, "component-likes", componentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const currentCount = docSnap.data().count || 0;
            if (currentCount > 0) {
                await updateDoc(docRef, {
                    count: increment(-1)
                });
            }
        }
    } catch (error) {
        console.error("Error decrementing like:", error);
    }
};
