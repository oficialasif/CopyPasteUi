export type ComponentItem = {
    id: string;
    name: string;
    category: string;
    slug: string;
    description: string;
    code: {
        react: string;
        html: string;
    };
};

export const components: ComponentItem[] = [
    {
        id: "nav-1",
        name: "Simple Navbar",
        category: "navbar",
        slug: "simple-navbar",
        description: "A responsive navigation bar with logo and navigation links.",
        code: {
            react: `export default function Navbar() {\n  return (\n    <nav className="border-b">\n      <div className="container mx-auto flex h-16 items-center px-4">\n        <div className="font-bold text-xl">Logo</div>\n        <div className="ml-auto flex gap-4 text-sm font-medium">\n          <a href="#">Home</a>\n          <a href="#">About</a>\n          <a href="#">Contact</a>\n        </div>\n      </div>\n    </nav>\n  );\n}`,
            html: `<nav class="border-b">\n  <div class="container mx-auto flex h-16 items-center px-4">\n    <div class="font-bold text-xl">Logo</div>\n    <div class="ml-auto flex gap-4 text-sm font-medium">\n      <a href="#">Home</a>\n      <a href="#">About</a>\n      <a href="#">Contact</a>\n    </div>\n  </div>\n</nav>`
        }
    },
    {
        id: "hero-1",
        name: "Centred Hero",
        category: "hero",
        slug: "centred-hero",
        description: "High-impact hero section with centered content and call-to-action buttons.",
        code: {
            react: `export default function Hero() {\n  return (\n    <section className="py-20 text-center">\n      <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">Build faster with CopyPaste</h1>\n      <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Beautifully designed components that you can copy and paste into your apps.</p>\n      <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium">Get Started</button>\n    </section>\n  );\n}`,
            html: `<section class="py-20 text-center">\n  <h1 class="text-4xl font-bold tracking-tight lg:text-5xl mb-4">Build faster with CopyPaste</h1>\n  <p class="text-muted-foreground mb-8 max-w-lg mx-auto">Beautifully designed components that you can copy and paste into your apps.</p>\n  <button class="bg-blue-600 text-white px-6 py-2 rounded-md font-medium">Get Started</button>\n</section>`
        }
    },
    {
        id: "card-1",
        name: "Feature Card",
        category: "cards",
        slug: "feature-card",
        description: "A clean card component with icon, title, and description.",
        code: {
            react: `export default function Card() {\n  return (\n    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">\n      <div className="h-12 w-12 bg-blue-100 rounded-lg mb-4" />\n      <h3 className="font-semibold text-lg mb-2">Feature Title</h3>\n      <p className="text-muted-foreground">Description of the feature goes here.</p>\n    </div>\n  );\n}`,
            html: `<div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">\n  <div class="h-12 w-12 bg-blue-100 rounded-lg mb-4"></div>\n  <h3 class="font-semibold text-lg mb-2">Feature Title</h3>\n  <p class="text-muted-foreground">Description of the feature goes here.</p>\n</div>`
        }
    }
];
