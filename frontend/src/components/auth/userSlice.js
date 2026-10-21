import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    token : window.localStorage.getItem("token") || null,
    name : window.localStorage.getItem("name") || null,
    email : window.localStorage.getItem("email") || null,
    id : window.localStorage.getItem("id") || null,
    mobile : window.localStorage.getItem("mobile") || null,
    role : window.localStorage.getItem("role") || null
}

export const userSlice = createSlice({
    initialState,
    name:"User",
    reducers:{
        updateToken:(state,{payload})=>{
            state.token = payload
        },
        updateName:(state,{payload})=>{
            state.name = payload
        },
        updateEmail:(state,{payload})=>{
            state.email = payload
        },
        updateId:(state,{payload})=>{
            state.id = payload
        },
        updateMobile:(state,{payload})=>{
            state.mobile = payload
        },
        updateRole:(state,{payload})=>{
            state.role = payload
        }
    }
})


export const {
    updateToken,
    updateName,
    updateEmail,
    updateId,
    updateMobile,
    updateRole
} = userSlice.actions;

const userReducer = userSlice.reducer;

export default userReducer;