import { DefaultUIFrame } from "@/components/DefaultUIFrame";
import { PostsFrame } from "@/components/PostsFrame";




export function MainPage() {
    return (
        <DefaultUIFrame Hirdetes={true}>
            <PostsFrame />

        </DefaultUIFrame>
    )
}
