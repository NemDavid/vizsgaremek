import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { PhaseEmail } from "./PhaseEmail"
import { PhaseOTP } from "./PhaseOTP"
import { PhaseSelectAccount } from "./PhaseSelectAccount"
import { PhaseResetPassword } from "./PhaseResetPassword"


export type PR_User={
    ID: number,
    email: string,
    username: string,
    avatar_url: string,
}

export function ForgetPasswordModal() {
    const [open, setOpen] = useState(false)
    const [phase, setPhase] = useState(1)

    const [email, setEmail] = useState<string>("")
    const [accounts, setAccounts] = useState<PR_User[]>([])
    const [selectedUser, setSelectedUser] = useState<PR_User| undefined>()
    
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild >
                <a href="#Forgot-Password" className="ml-auto text-sm underline-offset-4 hover:underline" >
                    Elfelejtette jelszavát?
                </a>
            </DialogTrigger>
            <DialogContent className="bg-red-100">
                <DialogTitle>
                    Jelszó-visszaállítás
                </DialogTitle>
                <DialogHeader>
                    {/* 1. Email → OTP küldése */}
                    {phase === 1 && (
                        <PhaseEmail
                            onSuccess={(enteredEmail) => {
                                setEmail(enteredEmail)
                                setPhase(2)
                            }}
                        />
                    )}

                    {/* 2. OTP ellenőrzése → visszaad account listát */}
                    {phase === 2 && (
                        <PhaseOTP
                            email={email}
                            onSuccess={(accountsResponse) => {
                                setAccounts(accountsResponse)
                                setPhase(3)
                            }}
                        />
                    )}

                    {/* 3. Account kiválasztása */}
                    {phase === 3 && (
                        <PhaseSelectAccount
                            accounts={accounts}
                            onSuccess={(account) => {
                                setSelectedUser(account)
                                setPhase(4)
                            }}
                        />
                    )}

                    {/* 4. Új jelszó beállítása */}
                    {phase === 4 && (
                        <PhaseResetPassword
                            user={selectedUser}
                            onSuccess={() => {
                                setOpen(false)
                                setPhase(1)

                            }}
                        />
                    )}
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