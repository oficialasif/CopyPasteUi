"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function AdminPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            alert("Login failed: " + err.message);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <div className="w-full max-w-md p-8 bg-background border rounded-xl shadow-lg glass">
                    <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full p-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full p-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">Login</Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                    <Button variant="outline" onClick={() => auth.signOut()}>Log Out</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-xl border bg-card shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Views</h3>
                    <p className="text-2xl font-bold">12,345</p>
                </div>
                <div className="p-6 rounded-xl border bg-card shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Components</h3>
                    <p className="text-2xl font-bold p-1">3</p>
                </div>
                <div className="p-6 rounded-xl border bg-card shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Ad Impressions</h3>
                    <p className="text-2xl font-bold">-</p>
                </div>
            </div>

            <div className="mt-8 border-t pt-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Manage Components</h2>
                    <Button>Add New Component</Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground font-medium">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t">
                                <td className="px-4 py-3">Simple Navbar</td>
                                <td className="px-4 py-3">Navbar</td>
                                <td className="px-4 py-3">simple-navbar</td>
                                <td className="px-4 py-3 text-right">
                                    <Button variant="ghost" size="sm">Edit</Button>
                                </td>
                            </tr>
                            {/* Map components here */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
