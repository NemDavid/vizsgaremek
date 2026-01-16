import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface PopOverProps {
    trigger: React.ReactNode; // ide 1
    children: React.ReactNode; // ide 2
    className?: string;
    ButtonStyle?: string;
    ContentStyle?: string;
}

export function PopOver({ trigger, children, className, ButtonStyle, ContentStyle }: PopOverProps) {
    return (
        <div className={className}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className={ButtonStyle}>
                        {trigger}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={ContentStyle}>
                    {children}
                </PopoverContent>
            </Popover>
        </div>
    )
}
