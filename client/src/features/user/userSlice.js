import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios.js'
import toast from 'react-hot-toast'


const initialState = {
    value: null,
    status: 'idle',   // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

export const fetchUser = createAsyncThunk('user/fetchUser', async (token, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/api/user/data', {
            headers: {Authorization: `Bearer ${token}`}
        })
        if(!data.success){
            return rejectWithValue(data.message)
        }
        return data.user
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message)
    }
})

export const updateUser = createAsyncThunk('user/update', async ({userData ,token}) => {
    const { data } = await api.post('/api/user/update', userData, {
        headers: {Authorization: `Bearer ${token}`}
    })
    if(data.success){
        toast.success(data.message)
        return data.user
    }else{
        toast.error(data.message)
        return null
    }
})


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: (builder)=>{
        builder
        .addCase(fetchUser.pending, (state)=>{
            state.status = 'loading'
            state.error = null
        })
        .addCase(fetchUser.fulfilled, (state, action)=>{
            state.status = 'succeeded'
            state.value = action.payload
        })
        .addCase(fetchUser.rejected, (state, action)=>{
            state.status = 'failed'
            state.error = action.payload || 'Failed to fetch user'
            state.value = null
        })
        .addCase(updateUser.fulfilled, (state, action)=>{
            state.value = action.payload
        })
    }
})

export default userSlice.reducer