import { db } from "@/lib/firebase";
import { collection, getDocs, doc, writeBatch, query, where } from "firebase/firestore";
import { components, ComponentItem } from "@/lib/components-data";

export interface ComponentData extends ComponentItem {
    // Add any new fields here if needed
}

export const getComponents = async (): Promise<ComponentData[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "components"));
        return querySnapshot.docs.map(doc => doc.data() as ComponentData);
    } catch (error) {
        console.error("Error getting components:", error);
        return [];
    }
};

export const seedComponents = async () => {
    // Check if components already exist to avoid overwriting/duplicates or high write costs
    const existing = await getComponents();
    if (existing.length > 0) {
        console.log("Database already seeded.");
        return;
    }

    const batch = writeBatch(db);

    components.forEach((component) => {
        const docRef = doc(collection(db, "components"), component.id); // Use static ID as doc ID
        batch.set(docRef, component);
    });

    try {
        await batch.commit();
        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}
