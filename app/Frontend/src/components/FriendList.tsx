import { AvatarFrame } from '@/components/AvatarFrame'

type User = {
  id: number
  name: string
  avatar_url: string
}

const users: User[] = [
  { id: 1, name: "Murrár Bálint", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Bálint" },
  { id: 2, name: "Hartwig-Matos Dávid Gábor", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Dávid" },
  { id: 3, name: "Petró Ádám", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Ádám" },
  { id: 4, name: "Kássa Gergő", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Gergő" },
  { id: 5, name: "Zsozéatya", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Zsozéatya" },
  { id: 6, name: "Farkas Norbert", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Norbert" },
  { id: 7, name: "Daniel Peter Szabo", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Daniel" },
  { id: 8, name: "Hunor Huszár", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Hunor" },
  { id: 9, name: "Fekete Bogi", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Bogi" },
  { id: 10, name: "Földi Dominik", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Dominik" },
  { id: 11, name: "Bakai Erik", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Erik" },
]
export function FriendList(){
    return (
    <div className="flex gap-3 overflow-x-auto border-b border-gray-300 p-3 bg-slate-100">
        <div className="flex gap-3 overflow-x-auto p-3">
            {users.map((user) => (
                <AvatarFrame user={user}/>
            ))}
        </div>
    </div>
    )
}

