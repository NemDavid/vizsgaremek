import { AvatarFrame } from '@/components/AvatarFrame'

type User = {
  id: bigint
  name: string
  avatar_url: string
}

const users: User[] = [
  { id: 1n, name: "Murrár Bálint", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Bálint" },
  { id: 2n, name: "Hartwig-Matos Dávid Gábor", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Dávid" },
  { id: 3n, name: "Petró Ádám", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Ádám" },
  { id: 4n, name: "Kássa Gergő", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Gergő" },
  { id: 5n, name: "Zsozéatya", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Zsozéatya" },
  { id: 6n, name: "Farkas Norbert", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Norbert" },
  { id: 7n, name: "Daniel Peter Szabo", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Daniel" },
  { id: 8n, name: "Hunor Huszár", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Hunor" },
  { id: 9n, name: "Fekete Bogi", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Bogi" },
  { id: 10n, name: "Földi Dominik", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Dominik" },
  { id: 11n, name: "Bakai Erik", avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Erik" },
]
export function FriendList(){
    return (
    <div className="flex gap-3 overflow-x-auto border-b border-gray-300 p-3 bg-slate-100">
        <div className="flex gap-3 overflow-x-auto p-3">
            {users.map((user) => (
                <AvatarFrame userid={user.id} className='max-w-max max-h-min p-0'/>
            ))}
        </div>
    </div>
    )
}

