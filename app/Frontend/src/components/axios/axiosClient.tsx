import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL;

export const ac = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

export const FileApi = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
//-------------------------------

//-------------------------------------------------------------------------------------
// #region GET
export async function authStatusRequest() {
  const response = await ac.get("/api/auth/status")
  
  return response;
}
export async function getuserByid(id: bigint) {
  const profil = await ac.get(`/api/profiles/${id}`)
  const adat = await {
    user: profil.data.user,
    profil: profil.data,
  }
  return adat;
}
export async function getPostsAll() {
  const response = await ac.get(`/api/posts/all`)
  return response.data
}
export async function getPosts({ page, perPage }: { page: number, perPage: number }) {
  const response = await ac.get(`/api/posts`, {
    params: {
      page,
      perPage,
    }
  })
  return response.data
}
export async function getMyreaction(POST_ID: bigint) {
  const response = await ac.get(`/api/reactions/${POST_ID}`)
  return response.data
}
export async function TokenStatusRequest(Token: string) {
  return await ac.get(`/api/auth/token/${Token}`);
}
export async function GetFriends() {
  return await ac.get(`/api/connections/me`);
}
export async function GetProfil(id: string) {
  return await ac.get(`/api/profiles/${id}`);
}
export async function myFriends() {
  return await ac.get(`/api/connections/me`);
}
export async function GetSettings() {
  return await ac.get(`/api/settings`);
}
// #endregion

//-------------------------------------------------------------------------------------
// #region POST
export async function loginRequest(data: any) {
  return await ac.post("/api/auth/login", data);
}
export async function RegisterRequest(data: any) {
  return await ac.post("/api/auth/register", data);
}
export async function RegisterConfirmRequest(data: FormData, token: string) {
  return await FileApi.post(`/api/auth/register/confirm/${token}`, data);
}
export async function createPost(data: FormData) {
  return await FileApi.post(`/api/posts`, data);
}
export async function makeReaction(data: { POST_ID: bigint; reaction: 'like' | 'dislike' }) {
  return await ac.post(`/api/reactions`, data);
}
export async function MakeCommentForPost(comment: any) {
  const response = await ac.post(`/api/comments`, comment)
  return response.data
}
export async function SendOTPToPasswordReset(email: string) {
  return await ac.post(`/api/auth/reset/send-code`, { email });
}
export async function SendVTCR({ email, verify_code }: { verify_code: string, email: string }) {
  return await ac.post(`/api/auth/reset/verify-code`, { verify_code, email });
}
export async function ChangePassword({ userId, password }: { userId: number, password: string }) {
  return await ac.post(`/api/auth/reset/new_password`, { userId, password });
}
export async function PostManager({ ConType, id }: { ConType?: string, id: bigint }) {
  return await ac.post(`/api/connections/${id}${ConType ? `/${ConType}` : ""}`);
}
export async function BlockUserID({id }: { id: bigint }) {
  return await PostManager({id,ConType: "blocked"})
}
export async function AddFriend({ id }: { id: bigint }) {
  return await PostManager({id});
}
export async function postKick(userId: bigint) {
  return await ac.post(`/api/kicks/kick/${userId}`);
}
// #endregion

//-------------------------------------------------------------------------------------
// #region PUT


// #endregion

//-------------------------------------------------------------------------------------
// #region PATCH
export async function UpdateProfile(data: FormData, id: number) {
  return await FileApi.patch(`/api/profiles/${id}`, data);
}
export async function connectionMangager({ ConType, id }: { ConType?: string, id: bigint }) {
  return await ac.patch(`/api/connections/${id}${ConType ? `/${ConType}` : ""}`);
}
export async function SaveSettings(Settings: any) {
  return await ac.patch(`/api/settings`,{...Settings});
}
// #endregion

//-------------------------------------------------------------------------------------
// #region DELETE
export async function logoutRequest() {
  return await ac.delete("/api/auth/logout");
}
export async function deletConnectionReqest({ id }: { id: bigint }) {
  return await ac.delete(`/api/connections/${id}`);
}

// #endregion
