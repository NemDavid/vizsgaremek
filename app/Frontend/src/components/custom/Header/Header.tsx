import { Link, useNavigate } from "@tanstack/react-router"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "../../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { authStatusRequest, logoutRequest } from "../../axios/axiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, Settings, User, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

const components: { title: string; to: string; description: string }[] = [
  {
    title: "Adatvédelem",
    to: "/settings/privacy",
    description:
      "Itt beállíthatod, hogy az adataidat kivel és milyen célból osztod meg.",
  },
  {
    title: "Fiókbeállítások",
    to: "/settings/account",
    description:
      "Módosíthatod az alapvető fiókbeállításokat, például a nevedet, a felhasználónevedet, az e-mail-címedet és a jelszavadat.",
  },
  {
    title: "Értesítések",
    to: "/settings/notification",
    description:
      "Itt beállíthatod, hogy milyen értesítéseket szeretnél e-mailben megkapni.",
  },
]



export default function Header({ className }: { className?: string }) {
  const [ShowHamburgermanu, setShowHamburgermanu] = useState(false);
  const [ShowSettings, setShowSettings] = useState(true);
  const [search, setSearch] = useState("");
  const nav = useNavigate()
  useEffect(() => {
    const checkSize = () => {
      setShowSettings(window.innerWidth >= 900);
      setShowHamburgermanu(window.innerWidth >= 777);
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);
  const { mutate: logut } = useMutation({
    mutationFn: () => logoutRequest(),
    onSuccess: () => {
      window.location.reload();
    }
  })
  const { data: auth } = useQuery({
    queryKey: ["auth-status"],
    queryFn: authStatusRequest,
    enabled: false,
  })

  return (
    <header className={`p-4 bg-red-950 text-white flex items-center justify-between z-99 ${className}`}>
      <Link to="/"><h1 className="text-3xl font-bold text-left p-2 pr-10">Mi Hírünk</h1></Link>
      {
        ShowHamburgermanu ? <>
          <div className="flex-1 flex justify-self-center">
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="flex gap-6 justify-center">

                {/* Kezdőlap */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-white bg-red-900`}>
                    <Link to="/">Kezdőlap</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Profil */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-white bg-red-900`}>
                    <Link to="/profil/$profilId" params={{ profilId: String(auth?.data.userID) }}>Profil</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Barátok */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-white bg-red-900`}>
                    <Link to="/connections">Kapcsolatok</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Search */}
                <NavigationMenuItem>
                  <div className="flex items-center gap-2 bg-red-900 px-3 py-2 rounded-md">
                    <Input type="text" placeholder="Felhasználó név" className="h-8" value={search}
                      onChange={(e) => setSearch(e.target.value)} />
                    <Button type="submit" variant="link" className="h-8 bg-rose-100" onClick={() => {nav({to:"/profil/$profilId", params: {profilId: search}}) }}>
                      Keres
                    </Button>
                  </div>
                </NavigationMenuItem>

                {/* Beállítások */}
                <NavigationMenuItem>
                  {ShowSettings ?
                    <>
                      <NavigationMenuTrigger className="text-white bg-red-900"><Link to="/settings">Beállítások</Link></NavigationMenuTrigger>
                      <NavigationMenuContent className="bg-red-300! text-white border-red-800 absolute ">
                        <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-1 lg:w-[600px] text-black">
                          {components.map((component) => (
                            <ListItem key={component.title} title={component.title} to={component.to}>
                              {component.description}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                    :
                    <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-white bg-red-900`}>
                      <Link to="/settings">Beállítások</Link>
                    </NavigationMenuLink>
                  }
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="bg-red-700 rounded-md p-1">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="bg-slate-200 text-black hover:text-white hover:bg-slate-600">Kijelentkezés</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-rose-100">
                <AlertDialogHeader>
                  <AlertDialogTitle>Biztos kijelentkezel?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Amennyiben kijelentkezel, újra be kell jelentkezned a fiókodba.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Mégse</AlertDialogCancel>
                  <AlertDialogAction onClick={() => logut()}>Kijelentkezés</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
          :
          <>
            <Sheet>
              <SheetTrigger className="bg-red-200 rounded-full w-10 h-10 flex items-center justify-center"><Menu className="size-6 text-black rounded-full" /></SheetTrigger>
              <SheetContent className="z-999 bg-red-200">
                <SheetHeader className="bg-red-400">
                  <SheetTitle className="text-black rounded-full bg-red-300 w-30 text-center">A fiókóm</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    to="/"
                    className="px-4 py-2 rounded hover:bg-red-100 bg-red-300"
                  >
                    Kezdő oldal
                  </Link>
                  <Link
                    params={{ profilId: String(auth?.data.userID) }}
                    to="/profil/$profilId"
                    className="px-4 py-2 rounded hover:bg-red-100 bg-red-300"
                  >
                    <User className="bg-red-200 rounded-full" />Profil
                  </Link>
                  <Link
                    to="/connections"
                    className="px-4 py-2 rounded hover:bg-red-100 bg-red-300"
                  >
                    <Users className="bg-red-200 rounded-full" />Barátok
                  </Link>
                  <Link
                    to="/settings"
                    className="px-4 py-2 rounded hover:bg-red-100 bg-red-300"
                  >
                    <Settings className="bg-red-200 rounded-full" />Beállítások
                  </Link>
                  <button
                    onClick={() => logut()}
                    className="px-4 py-2 rounded text-red-600 hover:bg-red-400 hover:text-white bg-red-100"
                  >
                    Kijelentkezés
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </>
      }

    </header>
  )
}

function ListItem({
  title,
  children,
  to,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { to: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={to}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug text-slate-800">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
