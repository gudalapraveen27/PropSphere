import {createSlice} from '@reduxjs/toolkit'

export const initialState={
    token:window.localStorage.getItem('token') || null,
    role:window.localStorage.getItem('role') || null,
    name:window.localStorage.getItem('name') || null,
    email:window.localStorage.getItem('email') || null,
    phone:window.localStorage.getItem('phone') || null,
    id:window.localStorage.getItem('id') || null,
    property:window.localStorage.getItem('property') || null,
}

export const userslice=createSlice({
    name:'user',
    initialState,
    reducers:{
        updatetoken:(state,{payload})=>{
            state.token=payload
        },
        updaterole:(state,{payload})=>{
            state.role=payload
        },
        updatename:(state,{payload})=>{
            state.name=payload
        },
        updateemail:(state,{payload})=>{
            state.email=payload
        },
        updatephone:(state,{payload})=>{
            state.phone=payload
        },
        updateid:(state,{payload})=>{
            state.id=payload
        },
        viewproperty:(state,{payload})=>{
            state.property=payload
        }
    }
})

export const {updatetoken,updaterole,updatename,updateemail,updatephone,updateid,viewproperty}=userslice.actions
const userreducer=userslice.reducer
export default userreducer