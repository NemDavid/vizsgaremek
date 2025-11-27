import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


export function ForgetPasswordModal() {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <a
                href="/Password-Reset"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Elfelejtette jelszavát?
              </a>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ret</DialogTitle>
                    <DialogDescription>
                        Oszd meg gondolataidat másokkal.
                    </DialogDescription>
                </DialogHeader>

            </DialogContent>
        </Dialog>
    )
}

