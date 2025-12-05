import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useNavigate } from "@tanstack/react-router";


export function ForgetPasswordModal() {
    const nav = useNavigate();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <a href="#Forgot-Password" className="ml-auto text-sm underline-offset-4 hover:underline">
                    Elfelejtette jelszavát?
                </a>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

/* 
küld post (email) -> email 6 számjegyű kód érkezik
-  post - 6 számu kod helyes (number) => emailnek a fiokjait adot vissza (Válasz: (useid,email, avatar_Url, username))
-  post - Kivalaszott fiok (userid, newpassword password) => elenőrződ a két jelszó  ha jó => megegyik jelszó változtatás Response( success: true )
*/