import api from './axios'

export const productAPI = {
    getAll:(params={})=>api.get('products/',{params}),
    getOne:(id)=>api.get(`products/${id}/`),
    create:(data)=>api.post('products/',data),
    update:(id,data)=>api.put(`products/${id}/`,data),
    delete:(id)=>api.delete(`products/${id}/`),
}

export const categoryAPI={
    getAll:()=>api.get('categories/'),
}