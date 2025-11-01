import axios from "axios"
import z from "zod"

export const axiosClient = axios.create({
  baseURL: "http://localhost:6769",
  headers: {
    "Content-Type": "application/json",
  }
})
export type formSchema = z.infer<typeof formSchema>
export const formSchema = z.object({
  username: z.string().min(2, "Túl rövid").max(50),
  email: z.string().email("Érvénytelen email"),
  password: z.string().min(6, "Legalább 6 karakter"),
})
export type User = {
  username: string
  password: string
  email: string
}

export async function createUser({ user }: { user: formSchema }) {
  const Response = axiosClient.post("api/user", user);
  return Response;
}