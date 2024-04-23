import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error:null,
    loading:false,
};

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart: (state)=>{
            state.loading = true;
            state.error = null;
        },
        signInSuccess:(state,action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInfailure: (state,action)=>{
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart: (state,action)=>{
            state.loading = true;
        },
        updateUserSuccess: (state,action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;

        },
        updateUserFailure: (state,action)=>{
            state.error = action.payload;
            state.loading = false;
        },
        changeLoading:(state,action)=>{
            state.loading = action.payload;
        },
        deleteUserSuccess:(state)=>{
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
        deleteUserFailure:(state,action)=>{
            state.error = action.payload;
            state.loading = false;
        }
        ,
        deleteUserStart:()=>{
            state.loading = true;
        }
        
    }
}
);

export const {deleteUserFailure,deleteUserStart,deleteUserSuccess,changeLoading,signInStart,signInSuccess,signInfailure,updateUserFailure,updateUserStart,updateUserSuccess} = userSlice.actions;
export default userSlice.reducer; 