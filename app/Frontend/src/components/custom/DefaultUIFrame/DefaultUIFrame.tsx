import AdsFrame from "../AdsFrame";
import { DrawerFriends } from "../Drawer-Friends/Drawer-Friends";
import { Footer } from "../Footer/footer";
import Header from "../Header/Header";
import { Toaster } from "sonner";
import React, { useEffect, useState } from "react";

export function DefaultUIFrame2({
    children,
    Hirdetes,
    Kicsi,
    className,
}: {
    children?: React.ReactNode;
    Hirdetes?: boolean;
    Kicsi?: boolean;
    className?: string;
}) {
    const showAds = Hirdetes === true;
    const isBottom = Kicsi === true;
    const HIDE_AFTER = 300;
    const [hideBottomAd, setHideBottomAd] = useState(false);

    useEffect(() => {
        if (!showAds || !isBottom) return;

        const onScroll = () => {
            setHideBottomAd(window.scrollY > HIDE_AFTER);
        };

        onScroll(); // init
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [showAds, isBottom]);

    const showBottomBanner = showAds && isBottom && !hideBottomAd;

    return (
        <div>
            <div className="flex flex-col h-screen">
                <Header />
                <div className="flex flex-1 bg-white text-black">
                    <div className="flex flex-1 h-full">
                        {showAds && !isBottom ? <AdsFrame id={1} variant="side" /> : null}
                        <div className={`w-full z-1 h-[calc(100vh-84px)] flex flex-col min-h-0 bg-red-950 ${className ?? ""}`}>
                            {children}
                        </div>
                        {showAds && !isBottom ? <AdsFrame id={2} variant="side" /> : null}
                    </div>
                </div>
            </div>

            {/* Bottom banner: eltűnik scroll után */}
            {showBottomBanner ? (
                <div className="fixed bottom-0 left-0 w-full h-24 bg-black z-50 flex items-center justify-center shadow-lg">
                    <AdsFrame id={3} variant="bottom" className="h-full w-full" />
                </div>
            ) : null}

            <DrawerFriends />
            <Footer />
            <Toaster richColors position="top-center" closeButton duration={3000} />
        </div>
    );
}

export function DefaultUIFrame({
    children,
    Hirdetes,
    Kicsi,
    className,
}: {
    children?: React.ReactNode;
    Hirdetes?: boolean;
    Kicsi?: boolean;
    className?: string;
}) {
    const showAds = Hirdetes === true;
    const isBottom = Kicsi === true;

    const HIDE_AFTER = 300;
    const [hideBottomAd, setHideBottomAd] = useState(false);
    const [FooterType, setFooterType] = useState(false);

    useEffect(() => {
        if (!showAds || !isBottom) return;
        const onScroll = () => setHideBottomAd(window.scrollY > HIDE_AFTER);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [showAds, isBottom]);

    useEffect(() => {
        const checkSize = () => {
            setFooterType(window.innerWidth >= 1000); // md alatt kikapcs
        };

        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);
    const showBottomBanner = showAds && isBottom && !hideBottomAd;
    const bottomPad = showBottomBanner ? "pb-48" : "";

    if (!FooterType)
        return (
            <div className="min-h-screen flex flex-col">
                <Header className="shrink-0" />
                <div className="flex-1 min-h-0 flex bg-white text-black">
                    {showAds && !isBottom && (
                        <div className="w-[300px] shrink-0 bg-red-950">
                            <AdsFrame id={1} variant="side" />
                        </div>
                    )}
                    <div
                        className={[
                            "flex-1 min-h-0 bg-red-950",
                            bottomPad,
                            className ?? "",
                        ].join(" ")}
                    >
                        {children}
                    </div>
                    {showAds && !isBottom && (
                        <div className="w-[300px] shrink-0 bg-red-950">
                            <AdsFrame id={2} variant="side" />
                        </div>
                    )}
                </div>
                <Footer />
                {showBottomBanner && (
                    <div className="fixed bottom-0 left-0 w-full h-48 bg-black z-50">
                        <AdsFrame id={3} variant="bottom" className="h-full w-full" />
                    </div>
                )}
                <DrawerFriends />
                <Toaster richColors position="top-center" closeButton duration={3000} />
            </div>
        );
    else
        return (
            <div>
                <div className="flex flex-col h-screen">
                    <Header />
                    <div className="flex flex-1 bg-white text-black">
                        <div className="flex flex-1 h-full">
                            {showAds && !isBottom ? <AdsFrame id={1} variant="side" /> : null}
                            <div className={`w-full z-1 h-[calc(100vh-84px)] flex flex-col min-h-0 bg-red-950 ${className ?? ""}`}>
                                {children}
                            </div>
                            {showAds && !isBottom ? <AdsFrame id={2} variant="side" /> : null}
                        </div>
                    </div>
                </div>

                {/* Bottom banner: eltűnik scroll után */}
                {showBottomBanner ? (
                    <div className="fixed bottom-0 left-0 w-full h-24 bg-black z-50 flex items-center justify-center shadow-lg">
                        <AdsFrame id={3} variant="bottom" className="h-full w-full" />
                    </div>
                ) : null}

                <DrawerFriends />
                <Footer />
                <Toaster richColors position="top-center" closeButton duration={3000} />
            </div>
        );
}
