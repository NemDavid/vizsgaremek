import { Link } from "@tanstack/react-router"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "./ui/button";
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
import { logoutRequest } from "./axios/axiosClient";
import { useMutation } from "@tanstack/react-query";

const components: { title: string; to: string; description: string }[] = [
  {
    title: "Adatvédelem",
    to: "/",
    description:
      "Beállíthatod, ki láthatja a későbbi bejegyzéseidet, és ki kereshet rád.",
  },
  {
    title: "Fiókbeállítások",
    to: "/",
    description:
      "Módosíthatod az olyan alapvető beállításokat, mint például a neved, a felhasználóneved vagy az e-mail-címed. A Nyelv és régió lehetőségre kattintva beállíthatod többek között azt a nyelvet és dátumformátumot, amelyet a Facebookon használni szeretnél.",
  },
  {
    title: "Biztonság",
    to: "/",
    description:
      "Megváltoztathatod a jelszavadat, és bekapcsolhatsz olyan figyelmeztetéseket és jóváhagyásokat, amelyek segítenek a fiókod biztonságának megőrzésében.",
  },
  {
    title: "Alkalmazások és webhelyek",
    to: "/",
    description: "Megtekintheted és kezelheted a facebookos bejelentkezéshez használt, illetve a Facebook-fiókoddal összekapcsolt alkalmazásokat és webhelyeket.",
  },
]

export default function Header({ className }: { className?: string }) {
  const { mutate: logut } = useMutation({
    mutationFn: () => logoutRequest(),
    onSuccess: () => {
      window.location.reload();
    }
  })

  return (
    <header className={`p-4 bg-red-950 text-white flex items-center justify-between z-99 ${className}`}>
      <h1 className="text-3xl font-bold text-left p-2 pr-10">Mi Hírünk</h1>

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
                <Link to="/profil/$profilId" params={{ profilId: "1" }}>Profil</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Barátok */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-white bg-red-900`}>
                <Link to="/friends">Barátok</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Beállítások */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white bg-red-900">Beállítások</NavigationMenuTrigger>
              <NavigationMenuContent className="bg-red-300! text-white border-red-800 absolute ">
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-1 lg:w-[600px] text-black">
                  {components.map((component) => (
                    <ListItem key={component.title} title={component.title} to={component.to}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="bg-red-700 rounded-md p-1">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="bg-slate-200 text-black hover:text-white hover:bg-slate-600">Kijelentkezés</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
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
