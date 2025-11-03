import axios from "axios"
import z from "zod"
import type { LoginSchema } from "../login-form"
import type { RegisterSchema } from "../signup-form"
import type {ConfirmSchema} from "../profil-setup-form"
export const ac = axios.create({
  baseURL: "http://localhost:6769",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})



export type formSchema = z.infer<typeof formSchema>

export const formSchema = z.object({
  username: z.string().min(2, "Túl rövid").max(50),
  email: z.email("Érvénytelen email"),
  password: z.string().min(6, "Legalább 6 karakter"),
})


export function loginRequest(data: LoginSchema ) {
  return ac.post("/api/login",data);
}

export function RegisterRequest(data: RegisterSchema ) {
  return ac.post("/api/registerUser",data);
}

export function RegisterConfirmRequest(data: ConfirmSchema,token: string ) {
  return ac.post(`/api/confirm/${token}`,data);
}

export function authStatusRequest() {
  return ac.get("/api/status");
}

export function logoutRequest() {
  return ac.delete("/api/logout");
}