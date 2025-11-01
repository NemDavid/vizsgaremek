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

export default function Header() {
  
  return (
    <header className="p-4 bg-red-600 text-white flex items-center justify-between">
      <h1 className="text-3xl font-bold text-left">Mi Hirünk</h1>

      <div className="flex-1 flex justify-self-center">
        <NavigationMenu viewport={false}>
        <NavigationMenuList className="flex gap-6 justify-center">
          {/* Kezdőlap */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-white bg-red-600`}>
              <Link to="/">Kezdőlap</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Profil */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-white bg-red-600`}>
              <Link to="/profil/$profilId" params={{ profilId: "1" }}>Profil</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Barátok */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-white bg-red-600`}>
              <Link to="/friends">Barátok</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Beállítások */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-white bg-red-600">Beállítások</NavigationMenuTrigger>
            <NavigationMenuContent className="text-white border-red-800">
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
