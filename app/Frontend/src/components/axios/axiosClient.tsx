import axios from "axios"
import type { AuthStatus, ProfileData } from "./Types";

const baseURL = import.meta.env.VITE_API_URL;

export const JsonClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

export const FormDataClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});


//-------------------------------------------------------------------------------------
// #region GET
export async function authStatusRequest() {
  const response = await JsonClient.get<AuthStatus>("/api/auth/status")
  return response;
}
export async function getuserByid(id: string) {
  const response = await GetProfil(id);
  const Data = {
    user: response.data.user,
    profil: response.data,
  }
  return Data;
}
export async function GetProfil(id: string) {
  const response = await JsonClient.get<ProfileData>(`/api/profiles/${id}`);
  return response;
}
export async function getPosts({ page, perPage }: { page: number, perPage: number }) {
  const response = await JsonClient.get(`/api/posts`, {
    params: {
      page,
      perPage,
    }
  })

  return response.data
}
export async function getMyreaction(POST_ID: bigint) {
  const response = await JsonClient.get(`/api/reactions/${POST_ID}`)

  return response.data
}
export async function TokenStatusRequest(Token: string) {
  const response = await JsonClient.get(`/api/auth/token/${Token}`);

  return response;
}
export async function GetMyFriends() {
  const response = await JsonClient.get(`/api/connections/me`);

  return response;
}
export async function GetSettings() {
  const response = await JsonClient.get(`/api/settings`);

  return response;
}
export async function GetAds() {
  const response = await JsonClient.get("api/advertisement/random")

  return response;
}
// #endregion

//-------------------------------------------------------------------------------------
// #region POST
export async function loginRequest(data: any) {
  const response = await JsonClient.post("/api/auth/login", data);

  return response;
}
export async function RegisterRequest(data: any) {
  const response = await JsonClient.post("/api/auth/register", data);

  return response;
}
export async function RegisterConfirmRequest(data: FormData, token: string) {
  const response = await FormDataClient.post(`/api/auth/register/confirm/${token}`, data);

  return response;
}
export async function createPost(data: FormData) {
  const response = await FormDataClient.post(`/api/posts`, data);

  return response;
}
export async function makeReaction(data: { POST_ID: bigint; reaction: 'like' | 'dislike' }) {
  const response = await JsonClient.post(`/api/reactions`, data);
  return response;
}
export async function MakeCommentForPost(comment: any) {
  const response = await JsonClient.post(`/api/comments`, comment)

  return response.data
}
export async function SendOTPToPasswordReset(email: string) {
  const response = await JsonClient.post(`/api/auth/reset/send-code`, { email });

  return response;
}
export async function SendVTCR({ email, verify_code }: { verify_code: string, email: string }) {
  const response = await JsonClient.post(`/api/auth/reset/verify-code`, { verify_code, email });
  return response;
}
export async function ChangePassword({ userId, password }: { userId: number, password: string }) {
  const response = await JsonClient.post(`/api/auth/reset/new_password`, { userId, password });
  return response;
}
export async function PostManager({ ConType, id }: { ConType?: string, id: bigint }) {
  const response = await JsonClient.post(`/api/connections/${id}${ConType ? `/${ConType}` : ""}`);
  return response;
}
export async function BlockUserID({ id }: { id: bigint }) {
  const response = await PostManager({ id, ConType: "blocked" })
  return response;
}
export async function AddFriend({ id }: { id: bigint }) {
  const response = await PostManager({ id });
  return response;
}
export async function postKick(userId: bigint) {
  const response = await JsonClient.post(`/api/kicks/${userId}`);
  return response;
}
// #endregion




//-------------------------------------------------------------------------------------
// #region PUT


// #endregion




//-------------------------------------------------------------------------------------
// #region PATCH
export async function UpdateProfile(data: FormData, id: number) {
  const response = await FormDataClient.patch(`/api/profiles/${id}`, data);

  return response;
}
export async function connectionMangager({ ConType, id }: { ConType?: string, id: bigint }) {
  const response = await JsonClient.patch(`/api/connections/${id}${ConType ? `/${ConType}` : ""}`);

  return response;
}
export async function SaveSettings(Settings: any) {
  const response = await JsonClient.patch(`/api/settings`, { ...Settings });

  return response;
}
// #endregion




//-------------------------------------------------------------------------------------
// #region DELETE
export async function logoutRequest() {
  const response = await JsonClient.delete("/api/auth/logout");

  return response;
}
export async function deletConnectionReqest({ id }: { id: bigint }) {
  const response = await JsonClient.delete(`/api/connections/${id}`);

  return response;
}
// #endregion



/**
 * TODO:
 * Nevek egységesítése:
 *    - CamelCase a JS/TS konvenció szerint: pl. `getProfile`, `tokenStatusRequest`, `sendOTPToPasswordReset`.
 */
