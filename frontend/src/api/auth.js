import api from './axios'

export const authAPI={
    register:(data)=> api.post('auth/register/',data),
    login:(data)=>api.post('auth/login/',data),
    me:()=>api.get('auth/me/'),
    updateprofile:(data)=>api.put('auth/me/',data),
}