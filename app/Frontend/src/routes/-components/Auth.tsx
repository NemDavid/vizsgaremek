import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LoginPage } from "./Login";
import { SignUpPage } from "./Register";
import { Toaster } from "sonner"

export function AuthPage() {
    const [showLogin, setShowLogin] = useState(true);
    const [isReady, setIsReady] = useState(false);

    const handleSwitch = () => setShowLogin((prev) => !prev);

    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 500);
        return () => clearTimeout(timer);
    }, []);

    if (!isReady) return null;

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Login oldal */}
            <motion.div
                animate={{
                    x: showLogin ? "0%" : "-100%",
                    opacity: showLogin ? 1 : 0.9,
                    zIndex: showLogin ? 2 : 1,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
            >
                <LoginPage onSwitch={handleSwitch} />
            </motion.div>

            {/* Register oldal */}
            <motion.div
                animate={{
                    x: showLogin ? "100%" : "0%",
                    opacity: showLogin ? 0.9 : 1,
                    zIndex: showLogin ? 1 : 2,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
            >
                <SignUpPage onSwitch={handleSwitch} />
            </motion.div>
            <Toaster richColors position="top-center" />
        </div>

    );
}
