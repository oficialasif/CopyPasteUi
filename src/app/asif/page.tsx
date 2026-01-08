'use client';

import { useState, useEffect } from 'react';
import {
    Plus, Trash2, Edit, Save, X, Eye, Copy,
    BarChart3, Code2, Layers, Search, LogOut,
    Chrome, Upload
} from 'lucide-react';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from 'firebase/firestore';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { db, auth, storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';

interface Component {
    id: string;
    name: string;
    slug: string;
    category: string;
    description: string;
    previewCode?: string; // Legacy
    previewImage?: string; // New Media URL
    htmlCode: string;
    tailwindCode: string;
    reactCode: string;
    installationCode?: string;
    usageCode?: string;
    codeTypes?: Record<string, string>;
    availableCodeTypes?: string[];
    views: number;
    copies: number;
    createdAt: any;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string;
}

export default function AdminPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'components' | 'categories'>('dashboard');

    const [components, setComponents] = useState<Component[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAddingComponent, setIsAddingComponent] = useState(false);
    const [editingComponent, setEditingComponent] = useState<Component | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        category: '',
        description: '',
        installationCode: '',
        usageCode: '',
        previewImage: '', // Replaces previewCode
        codeTypes: {} as Record<string, string>, // Dynamic code types
        availableCodeTypes: [] as string[], // Which types are available
        badge: null as 'new' | 'updated' | null,
        isComingSoon: false
    });

    const [selectedCodeType, setSelectedCodeType] = useState('');

    // File Upload State
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(10); // Initial progress

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Fake progress since fetch doesn't support it natively for uploads easily without XHR
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            const data = await response.json();

            if (data.success) {
                setFormData(prev => ({ ...prev, previewImage: data.url }));
            } else {
                throw new Error(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Upload failed! Check console for details.');
        } finally {
            setIsUploading(false);
            setTimeout(() => setUploadProgress(0), 1000);
        }
    };
    const codeTypeOptions = [
        'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular',
        'HTML', 'CSS', 'Tailwind', 'SCSS', 'Svelte'
    ];

    const [stats, setStats] = useState({
        totalComponents: 0,
        totalCategories: 0,
        totalViews: 0,
        totalCopies: 0
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (currentUser) {
                loadData();
            }
        });

        return () => unsubscribe();
    }, []);

    const loadData = async () => {
        try {
            const componentsSnap = await getDocs(collection(db, 'components'));
            const componentsData = componentsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Component[];
            setComponents(componentsData);

            const categoriesSnap = await getDocs(collection(db, 'categories'));
            const categoriesData = categoriesSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Category[];
            setCategories(categoriesData);

            const totalViews = componentsData.reduce((sum, c) => sum + (c.views || 0), 0);
            const totalCopies = componentsData.reduce((sum, c) => sum + (c.copies || 0), 0);

            setStats({
                totalComponents: componentsData.length,
                totalCategories: categoriesData.length,
                totalViews,
                totalCopies
            });
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Error signing in:', error);
            alert('Failed to sign in with Google');
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };



    const handleSaveComponent = async () => {
        try {
            // Auto-create category if it doesn't exist
            const categoryName = formData.category.trim();
            if (!categoryName) {
                alert('Please enter a category name');
                return;
            }

            const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');

            // Check if category already exists
            const existingCategory = categories.find(
                cat => cat.slug === categorySlug || cat.name.toLowerCase() === categoryName.toLowerCase()
            );

            if (!existingCategory) {
                // Create new category
                await addDoc(collection(db, 'categories'), {
                    name: categoryName,
                    slug: categorySlug,
                    icon: 'Box',
                    createdAt: serverTimestamp()
                });
                console.log(`Created new category: ${categoryName}`);
            }

            // Save component with category slug
            const componentData = {
                ...formData,
                category: categorySlug,
            };

            if (editingComponent) {
                const docRef = doc(db, 'components', editingComponent.id);
                await updateDoc(docRef, {
                    ...componentData,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, 'components'), {
                    ...componentData,
                    views: 0,
                    copies: 0,
                    createdAt: serverTimestamp()
                });
            }

            resetForm();
            loadData();
            alert(editingComponent ? 'Component updated!' : 'Component added successfully!');
        } catch (error) {
            console.error('Error saving component:', error);
            alert('Failed to save component');
        }
    };

    const handleDeleteComponent = async (id: string) => {
        if (confirm('Are you sure you want to delete this component?')) {
            try {
                await deleteDoc(doc(db, 'components', id));
                loadData();
            } catch (error) {
                console.error('Error deleting component:', error);
            }
        }
    };

    const handleEditComponent = (component: Component) => {
        setEditingComponent(component);

        // Find category name from slug
        const category = categories.find(cat => cat.slug === component.category);
        const categoryName = category ? category.name : component.category;

        // Convert old structure to new if needed
        const codeTypes: Record<string, string> = {};
        const availableTypes: string[] = [];

        // Check for old structure and convert
        if ((component as any).reactCode) {
            codeTypes['React'] = (component as any).reactCode;
            availableTypes.push('React');
        }
        if ((component as any).htmlCode) {
            codeTypes['HTML'] = (component as any).htmlCode;
            availableTypes.push('HTML');
        }
        if ((component as any).tailwindCode) {
            codeTypes['Tailwind'] = (component as any).tailwindCode;
            availableTypes.push('Tailwind');
        }

        // Use new structure if available
        if ((component as any).codeTypes) {
            Object.assign(codeTypes, (component as any).codeTypes);
        }
        if ((component as any).availableCodeTypes) {
            availableTypes.push(...(component as any).availableCodeTypes.filter((t: string) => !availableTypes.includes(t)));
        }

        setFormData({
            name: component.name,
            slug: component.slug,
            category: categoryName,
            description: component.description,
            installationCode: (component as any).installationCode || '',
            usageCode: (component as any).usageCode || '',
            previewImage: (component as any).previewImage || (component as any).previewCode || '', // Migrate old previewCode if serves as URL? No, best to start clean or map
            codeTypes,
            availableCodeTypes: availableTypes,
            badge: (component as any).badge || null,
            isComingSoon: (component as any).isComingSoon || false
        });
        setIsAddingComponent(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            category: '',
            description: '',
            installationCode: '',
            usageCode: '',
            previewImage: '',
            codeTypes: {},
            availableCodeTypes: [],
            badge: null,
            isComingSoon: false
        });
        setEditingComponent(null);
        setIsAddingComponent(false);
    };

    const filteredComponents = components.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030014] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#030014] via-[#0A0A1E] to-[#030014] flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mb-8"
                        >
                            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mb-4 border border-indigo-500/20">
                                <Code2 className="w-12 h-12 text-indigo-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Admin Dashboard
                            </h1>
                            <p className="text-zinc-400">
                                Sign in to manage CopyPasteUI
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <button
                                onClick={handleGoogleSignIn}
                                className="w-full group relative overflow-hidden px-6 py-4 rounded-xl bg-white hover:bg-gray-50 text-gray-900 font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Chrome className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">Continue with Google</span>
                            </button>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-zinc-500">
                                    Secure authentication powered by Firebase
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-8 pt-8 border-t border-white/10"
                        >
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                {[
                                    { icon: Code2, text: 'Manage Components' },
                                    { icon: Layers, text: 'Organize Categories' },
                                    { icon: BarChart3, text: 'View Analytics' },
                                    { icon: Eye, text: 'Track Performance' }
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-zinc-400">
                                        <feature.icon className="w-4 h-4 text-indigo-400" />
                                        <span>{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center mt-6 text-sm text-zinc-500"
                    >
                        CopyPasteUI Admin Panel v1.0
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030014]">
            <div className="border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-500/10">
                                <Code2 className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">CopyPasteUI Admin</h1>
                                <p className="text-xs text-zinc-500">Dashboard</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5">
                                <img
                                    src={user.photoURL || ''}
                                    alt={user.displayName || 'User'}
                                    className="w-8 h-8 rounded-full"
                                />
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-white">{user.displayName}</p>
                                    <p className="text-xs text-zinc-500">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex gap-2 mb-8 border-b border-white/10">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                            { id: 'components', label: 'Components', icon: Code2 },
                            { id: 'categories', label: 'Categories', icon: Layers }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative ${activeTab === tab.id
                                    ? 'text-indigo-400'
                                    : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'dashboard' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Components', value: stats.totalComponents, icon: Code2, color: 'indigo' },
                                    { label: 'Categories', value: stats.totalCategories, icon: Layers, color: 'purple' },
                                    { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'pink' },
                                    { label: 'Total Copies', value: stats.totalCopies, icon: Copy, color: 'cyan' }
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-all"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`p-2 rounded-lg bg-${stat.color}-500/10`}>
                                                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                                            </div>
                                            <h3 className="text-sm font-medium text-zinc-400">{stat.label}</h3>
                                        </div>
                                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10">
                                <h2 className="text-xl font-bold text-white mb-4">Top Performing Components</h2>
                                <div className="space-y-3">
                                    {components
                                        .sort((a, b) => (b.views || 0) - (a.views || 0))
                                        .slice(0, 5)
                                        .map((component) => (
                                            <div
                                                key={component.id}
                                                className="flex items-center justify-between p-4 rounded-lg bg-[#111] border border-white/5"
                                            >
                                                <div>
                                                    <p className="font-medium text-white">{component.name}</p>
                                                    <p className="text-sm text-zinc-500 capitalize">{component.category}</p>
                                                </div>
                                                <div className="flex items-center gap-6 text-sm">
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Eye className="w-4 h-4" />
                                                        {component.views || 0}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Copy className="w-4 h-4" />
                                                        {component.copies || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'components' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="text"
                                        placeholder="Search components..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50"
                                    />
                                </div>
                                <button
                                    onClick={() => setIsAddingComponent(true)}
                                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Component
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {filteredComponents.map((component) => (
                                    <motion.div
                                        key={component.id}
                                        layout
                                        className="p-6 rounded-xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-all"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-white mb-1">{component.name}</h3>
                                                <p className="text-sm text-zinc-400 mb-3">{component.description}</p>
                                                <div className="flex items-center gap-4 text-sm text-zinc-500">
                                                    <span className="capitalize">{component.category}</span>
                                                    <span>•</span>
                                                    <span>{component.views || 0} views</span>
                                                    <span>•</span>
                                                    <span>{component.copies || 0} copies</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditComponent(component)}
                                                    className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteComponent(component.id)}
                                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'categories' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Categories Management</h2>
                                <button
                                    onClick={() => {
                                        const name = prompt('Enter category name:');
                                        if (name) {
                                            const slug = name.toLowerCase().replace(/\s+/g, '-');
                                            addDoc(collection(db, 'categories'), {
                                                name,
                                                slug,
                                                icon: 'Box',
                                                createdAt: serverTimestamp()
                                            }).then(() => {
                                                loadData();
                                                alert('Category added successfully!');
                                            }).catch((error) => {
                                                console.error('Error adding category:', error);
                                                alert('Failed to add category');
                                            });
                                        }
                                    }}
                                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Category
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="p-4 rounded-lg bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-all group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-white">{category.name}</p>
                                                <p className="text-sm text-zinc-500">{category.slug}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Delete category "${category.name}"?`)) {
                                                        deleteDoc(doc(db, 'categories', category.id))
                                                            .then(() => {
                                                                loadData();
                                                                alert('Category deleted!');
                                                            })
                                                            .catch((error) => {
                                                                console.error('Error deleting category:', error);
                                                                alert('Failed to delete category');
                                                            });
                                                    }
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {categories.length === 0 && (
                                <div className="text-center py-12 text-zinc-500">
                                    <p>No categories yet. Add your first category!</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isAddingComponent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => resetForm()}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0A0A0A] rounded-2xl border border-white/10 p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingComponent ? 'Edit Component' : 'Add New Component'}
                                </h2>
                                <button
                                    onClick={() => resetForm()}
                                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50"
                                            placeholder="Component name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Slug</label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50"
                                            placeholder="component-slug"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Category</label>
                                        <input
                                            type="text"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50"
                                            placeholder="e.g., Text Animations, Buttons, Cards"
                                            list="existing-categories"
                                        />
                                        <datalist id="existing-categories">
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.name} />
                                            ))}
                                        </datalist>
                                        <p className="text-xs text-zinc-500 mt-1">
                                            Type a new category name to create it, or select from existing ones
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 resize-none"
                                        rows={2}
                                        placeholder="Brief description"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Badge</label>
                                        <select
                                            value={formData.badge || ''}
                                            onChange={(e) => setFormData({ ...formData, badge: (e.target.value || null) as 'new' | 'updated' | null })}
                                            className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50"
                                        >
                                            <option value="">None</option>
                                            <option value="new">New</option>
                                            <option value="updated">Updated</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.isComingSoon}
                                                onChange={(e) => setFormData({ ...formData, isComingSoon: e.target.checked })}
                                                className="w-4 h-4 rounded bg-[#111] border border-white/10 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-zinc-400">Coming Soon</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Preview Image/Video URL</label>
                                    <input
                                        type="text"
                                        value={formData.previewImage}
                                        onChange={(e) => setFormData({ ...formData, previewImage: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50"
                                        placeholder="https://drive.google.com/... or Image URL"
                                    />
                                    <p className="text-xs text-zinc-500 mt-1 mb-3">
                                        Supports Google Drive, YouTube, or direct image/video links.
                                    </p>

                                    <div className="border-t border-white/10 pt-3">
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Or Upload File</label>
                                        <div className="flex items-center gap-3">
                                            <label className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <Upload className="w-4 h-4 text-zinc-400" />
                                                <span className="text-sm text-zinc-300">Choose File</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileUpload}
                                                    accept="image/*,video/*"
                                                />
                                            </label>
                                            {isUploading && (
                                                <div className="flex-1 max-w-[200px]">
                                                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-indigo-500 transition-all duration-300"
                                                            style={{ width: `${uploadProgress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-zinc-500 mt-1">{Math.round(uploadProgress)}% uploaded</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">CLI Installation Command</label>
                                    <input
                                        type="text"
                                        value={formData.installationCode}
                                        onChange={(e) => setFormData({ ...formData, installationCode: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 font-mono text-sm"
                                        placeholder="e.g. npx shadcn@latest add button"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Usage Example Code</label>
                                    <textarea
                                        value={formData.usageCode}
                                        onChange={(e) => setFormData({ ...formData, usageCode: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 font-mono text-sm resize-none"
                                        rows={6}
                                        placeholder="import MyComponent from..."
                                    />
                                </div>

                                {/* Dynamic Code Types Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-zinc-400">Code Types</label>
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={selectedCodeType}
                                                onChange={(e) => setSelectedCodeType(e.target.value)}
                                                className="px-3 py-1.5 rounded-lg bg-[#111] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                                            >
                                                <option value="">Select type...</option>
                                                {codeTypeOptions.filter(type => !formData.availableCodeTypes.includes(type)).map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (selectedCodeType && !formData.availableCodeTypes.includes(selectedCodeType)) {
                                                        setFormData({
                                                            ...formData,
                                                            availableCodeTypes: [...formData.availableCodeTypes, selectedCodeType],
                                                            codeTypes: { ...formData.codeTypes, [selectedCodeType]: '' }
                                                        });
                                                        setSelectedCodeType('');
                                                    }
                                                }}
                                                disabled={!selectedCodeType}
                                                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                                            >
                                                Add Type
                                            </button>
                                        </div>
                                    </div>

                                    {/* Display added code types */}
                                    {formData.availableCodeTypes.map((type) => (
                                        <div key={type} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="block text-sm font-medium text-zinc-400">{type} Code</label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newCodeTypes = { ...formData.codeTypes };
                                                        delete newCodeTypes[type];
                                                        setFormData({
                                                            ...formData,
                                                            availableCodeTypes: formData.availableCodeTypes.filter(t => t !== type),
                                                            codeTypes: newCodeTypes
                                                        });
                                                    }}
                                                    className="text-xs text-red-400 hover:text-red-300"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <textarea
                                                value={formData.codeTypes[type] || ''}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    codeTypes: { ...formData.codeTypes, [type]: e.target.value }
                                                })}
                                                className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 font-mono text-sm resize-none"
                                                rows={6}
                                                placeholder={`${type} code`}
                                            />
                                        </div>
                                    ))}

                                    {formData.availableCodeTypes.length === 0 && (
                                        <p className="text-sm text-zinc-500 text-center py-4">No code types added yet. Select a type above to get started.</p>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleSaveComponent}
                                        className="flex-1 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        {editingComponent ? 'Update Component' : 'Save Component'}
                                    </button>
                                    <button
                                        onClick={() => resetForm()}
                                        className="px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
