import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCw7Eg6JMqFZf1SQW0KbgPTjL_-rczJRpU",
    authDomain: "copypasteui26.firebaseapp.com",
    projectId: "copypasteui26",
    storageBucket: "copypasteui26.firebasestorage.app",
    messagingSenderId: "607326162508",
    appId: "1:607326162508:web:d03e0174a3313677f3aee9",
    measurementId: "G-8Z76QB0T8K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample data
const categories = [
    { name: "Text Animations", slug: "text-animations", icon: "Type" },
    { name: "Buttons", slug: "buttons", icon: "MousePointer2" },
    { name: "Cards", slug: "cards", icon: "Square" },
    { name: "Navbars", slug: "navbars", icon: "Layout" }
];

const components = [
    {
        name: "Split Text",
        slug: "split-text",
        category: "text-animations",
        description: "Animated text that splits character by character with smooth transitions",
        badge: "new",
        isComingSoon: false,
        previewCode: `<div class="split-text">Hello World</div>`,
        htmlCode: `<div class="split-text" data-text="Hello World">
  <span>H</span><span>e</span><span>l</span><span>l</span><span>o</span>
  <span> </span>
  <span>W</span><span>o</span><span>r</span><span>l</span><span>d</span>
</div>`,
        tailwindCode: `.split-text span {
  @apply inline-block opacity-0 animate-fade-in;
  animation-delay: calc(var(--i) * 0.1s);
}`,
        reactCode: `export default function SplitText({ text }: { text: string }) {
  return (
    <div className="split-text">
      {text.split('').map((char, i) => (
        <span key={i} style={{ '--i': i } as any}>
          {char}
        </span>
      ))}
    </div>
  );
}`
    },
    {
        name: "Blur Text",
        slug: "blur-text",
        category: "text-animations",
        description: "Text with blur animation effect on hover",
        badge: null,
        isComingSoon: false,
        previewCode: `<h1 class="blur-text">Hover Me</h1>`,
        htmlCode: `<h1 class="blur-text">Hover Me</h1>`,
        tailwindCode: `.blur-text {
  @apply text-4xl font-bold transition-all duration-300;
  filter: blur(0px);
}
.blur-text:hover {
  filter: blur(3px);
}`,
        reactCode: `export default function BlurText({ children }: { children: React.ReactNode }) {
  return <h1 className="blur-text">{children}</h1>;
}`
    },
    {
        name: "Gradient Button",
        slug: "gradient-button",
        category: "buttons",
        description: "Beautiful gradient button with hover effects and smooth transitions",
        badge: null,
        isComingSoon: false,
        previewCode: `<button class="gradient-btn">Click Me</button>`,
        htmlCode: `<button class="gradient-btn">Click Me</button>`,
        tailwindCode: `.gradient-btn {
  @apply px-6 py-3 rounded-lg font-semibold text-white;
  @apply bg-gradient-to-r from-indigo-500 to-purple-600;
  @apply hover:from-indigo-600 hover:to-purple-700;
  @apply transition-all duration-300 transform hover:scale-105;
  @apply shadow-lg hover:shadow-xl;
}`,
        reactCode: `export default function GradientButton({ children, onClick }: any) {
  return (
    <button className="gradient-btn" onClick={onClick}>
      {children}
    </button>
  );
}`
    },
    {
        name: "Glow Button",
        slug: "glow-button",
        category: "buttons",
        description: "Button with glowing effect on hover",
        badge: "updated",
        isComingSoon: false,
        previewCode: `<button class="glow-btn">Glow Effect</button>`,
        htmlCode: `<button class="glow-btn">Glow Effect</button>`,
        tailwindCode: `.glow-btn {
  @apply px-6 py-3 rounded-lg font-semibold;
  @apply bg-blue-600 text-white;
  @apply transition-all duration-300;
  box-shadow: 0 0 0 rgba(59, 130, 246, 0);
}
.glow-btn:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
}`,
        reactCode: `export default function GlowButton({ children }: any) {
  return <button className="glow-btn">{children}</button>;
}`
    },
    {
        name: "Pricing Card",
        slug: "pricing-card",
        category: "cards",
        description: "Modern pricing card with features list and CTA button",
        badge: null,
        isComingSoon: true,
        previewCode: `<div class="pricing-card">Coming Soon</div>`,
        htmlCode: `<div class="pricing-card">
  <h3>Pro Plan</h3>
  <p class="price">$29/mo</p>
  <ul>
    <li>Feature 1</li>
    <li>Feature 2</li>
    <li>Feature 3</li>
  </ul>
  <button>Get Started</button>
</div>`,
        tailwindCode: `.pricing-card {
  @apply p-6 rounded-2xl bg-white border border-gray-200;
  @apply shadow-lg hover:shadow-xl transition-all;
}`,
        reactCode: `export default function PricingCard() {
  return <div className="pricing-card">Coming Soon</div>;
}`
    },
    {
        name: "Simple Navbar",
        slug: "simple-navbar",
        category: "navbars",
        description: "Clean and responsive navigation bar with logo and menu items",
        badge: "new",
        isComingSoon: false,
        previewCode: `<nav class="navbar">
  <div class="logo">Logo</div>
  <ul>
    <li>Home</li>
    <li>About</li>
    <li>Contact</li>
  </ul>
</nav>`,
        htmlCode: `<nav class="navbar">
  <div class="logo">Logo</div>
  <ul class="menu">
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>`,
        tailwindCode: `.navbar {
  @apply flex items-center justify-between px-6 py-4;
  @apply bg-white border-b border-gray-200;
}
.navbar .menu {
  @apply flex gap-6;
}
.navbar .menu li a {
  @apply text-gray-700 hover:text-indigo-600 transition-colors;
}`,
        reactCode: `export default function SimpleNavbar() {
  return (
    <nav className="navbar">
      <div className="logo">Logo</div>
      <ul className="menu">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}`
    }
];

async function seedData() {
    try {
        console.log("🌱 Starting to seed data...");

        // Add categories
        console.log("\n📁 Adding categories...");
        for (const category of categories) {
            await addDoc(collection(db, "categories"), {
                ...category,
                createdAt: serverTimestamp()
            });
            console.log(`✅ Added category: ${category.name}`);
        }

        // Add components
        console.log("\n🎨 Adding components...");
        for (const component of components) {
            await addDoc(collection(db, "components"), {
                ...component,
                views: 0,
                copies: 0,
                createdAt: serverTimestamp()
            });
            console.log(`✅ Added component: ${component.name}`);
        }

        console.log("\n✨ Seed data added successfully!");
        console.log("\n📊 Summary:");
        console.log(`   - ${categories.length} categories`);
        console.log(`   - ${components.length} components`);
        console.log("\n🚀 You can now view them at http://localhost:3000/components");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    }
}

seedData();
