# CopyPasteUI

A modern, component-based UI library built with Next.js, Tailwind CSS, and Framer Motion.

## Features

- 🎨 **Beautiful Components**: Ready-to-use, aesthetically pleasing components.
- ⚡ **Copy & Paste**: Zero-install philosophy. Just copy the code and drop it in.
- 🌙 **Dark Mode**: Built-in support for light and dark themes.
- 📱 **Responsive**: Mobile-first design.
- 📂 **Admin Panel**: Manage components, categories, and uploads clearly.
- ☁️ **Local & Cloud Storage**: Support for local file uploads and Firebase integration.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/copypaste-ui.git
    cd copypaste-ui
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your Firebase credentials.
    
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Firebase Firestore
- **Icons**: Lucide React

## License

MIT
