import { DefaultUIFrame } from "@/components/custom/DefaultUIFrame/DefaultUIFrame";
import { PostsFrame } from "@/components/PostComponents";
import { useEffect, useState } from "react";




export function MainPage() {
    const [showAd, setShowAd] = useState(true);

    useEffect(() => {
        const checkSize = () => {
            setShowAd(window.innerWidth >= 900); // md alatt kikapcs
        };

        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);
    return (
        <DefaultUIFrame Hirdetes={true} Kicsi={!showAd}>
            <PostsFrame />

        </DefaultUIFrame>
    )
}
