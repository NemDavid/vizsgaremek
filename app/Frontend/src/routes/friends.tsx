import { AuthGuard } from '@/components/AuthGuard'
import { DefaultUIFrame } from '@/components/DefaultUIFrame'
import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AvatarFrame } from '@/components/AvatarFrame'
import { Button } from '@/components/ui/button'
import { BadgePlus, BadgeX, Trash } from 'lucide-react'

export const Route = createFileRoute('/friends')({
  component: () => (
    <AuthGuard>
      <RouteComponent />
    </AuthGuard>
  ),
})


function RouteComponent() {
  const asd = 1;
  return (
    <DefaultUIFrame className='bg-red-100'>
      <Card className='bg-red-200 border-1 border-red-700 my-4 mx-2'>
        <CardHeader>
          <CardTitle>Barátok</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex gap-4 flex-wrap'>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <Button variant={"outline"}> <img src="/kicking.png" alt="Kick" className='size-6 bg-slate-200 rounded-full' /> Rugás</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className='bg-red-200 border-1 border-red-700 my-4 mx-2'>
        <CardHeader>
          <CardTitle>Felkérések</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex gap-4 flex-wrap'>
            <div className='px-4 bg-rose-100 flex flex-col items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <div className='grid grid-cols-2 gap-2 w-full'>
                <Button variant={"outline"} className='mb-2 mx-1'> <BadgePlus className='size-4' />Elfogad</Button>
                <Button variant={'destructive'} className='mb-2 mx-1'> <Trash className='size-4' />Elutasit</Button>
                <Button variant={'destructive'} className='mb-2 mx-1 col-span-2'> <Trash className='size-4' />Block</Button>
              </div>
            </div>
            <div className='px-4 bg-rose-100 flex flex-col items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <div className='grid grid-cols-2 gap-2 w-full'>
                <Button variant={"outline"} className='mb-2 mx-1'> <BadgePlus className='size-4' />Elfogad</Button>
                <Button variant={'destructive'} className='mb-2 mx-1'> <Trash className='size-4' />Elutasit</Button>
                <Button variant={'destructive'} className='mb-2 mx-1 col-span-2'> <Trash className='size-4' />Block</Button>
              </div>
            </div>
            <div className='px-4 bg-rose-100 flex flex-col items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 m-4' />
              <div className='grid grid-cols-2 gap-2 w-full'>
                <Button variant={"outline"} className='mb-2 mx-1'> <BadgePlus className='size-4' />Elfogad</Button>
                <Button variant={'destructive'} className='mb-2 mx-1'> <Trash className='size-4' />Elutasit</Button>
                <Button variant={'destructive'} className='mb-2 mx-1 col-span-2'> <Trash className='size-4' />Block</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className='bg-red-200 border-1 border-red-700 my-4 mx-2'>
        <CardHeader>
          <CardTitle>Tiltások</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex gap-4 flex-wrap'>
            <div className='px-4 bg-rose-100 flex flex-col items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 mt-4 mb-2' />
              <Button variant={"destructive"} className='mb-3 mx-3'> <BadgeX className='size-4' />Feloldás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex flex-col items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 mt-4 mb-2' />
              <Button variant={"destructive"} className='mb-3 mx-3'> <BadgeX className='size-4' />Feloldás</Button>
            </div>
            <div className='px-4 bg-rose-100 flex flex-col items-center rounded-xl'>
              <AvatarFrame userid={asd} className='max-w-max max-h-min p-0 bg-slate-200 mt-4 mb-2' />
              <Button variant={"destructive"} className='mb-3 mx-3'> <BadgeX className='size-4' />Feloldás</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DefaultUIFrame>
  )
}

