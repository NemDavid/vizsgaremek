import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button" 


export type Post = {
    header: string,
    hasMedia: boolean,
    content: string,
    created_at: Date,
    updated_at: Date,
    like: number,
    dislike: number,
}

export function PostAccord({post,name}:{post:Post,name:string})
{
    return (
        <Card className="py-0 gap-2">
            <CardContent>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="relative flex items-center justify-center">
                            <div className="absolute left-2 flex items-center cursor-pointer transition rounded-full pr-3">
                                <img src="/Lakatos_Dszumandzsi.png" className="w-10 h-10 rounded-full object-cover"/>
                                <span className="text-sm ml-2 overflow-hidden max-w-[110px]" title={name}>{name.split(' ')[1]}</span>
                            </div>
                            <span className="underline decoration-double text-lg text-center" >cime more éééééé</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            {post.content}
                            {post.hasMedia ? (
                                <img
                                src="/Lakatos_Dszumandzsi.png" // helyettesítsd a saját képed elérési útvonalával
                                alt="Post media"
                                className="rounded-lg mt-2 max-h-60 object-cover"
                                />
                            ) : null}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
            <CardFooter className="flex justify-center items-center border-t pt-4 pb-1">
                <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.like}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <ThumbsDown className="h-4 w-4" />
                    <span>{post.dislike}</span>  
                </Button>
                </div>
            </CardFooter>
        </Card>
    )
}


