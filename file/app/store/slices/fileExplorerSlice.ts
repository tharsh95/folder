import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FileNode {
  id: string;
  name: string;
  isFolder: boolean;
  items: FileNode[];
}

interface FileExplorerState {
  data: FileNode[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: FileExplorerState = {
  data: null,
  status: 'idle'
}

// No async thunks; components will call Next.js API routes and dispatch reducers

const fileExplorerSlice = createSlice({
  name: 'fileExplorer',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<FileNode[] | null>) => {
      state.data = action.payload
      state.status = 'succeeded'
      state.error = undefined
    },
    setStatus: (state, action: PayloadAction<FileExplorerState['status']>) => {
      state.status = action.payload
    },
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload
    }
  },
  extraReducers: () => {}
})

export const { setData, setStatus, setError } = fileExplorerSlice.actions
export default fileExplorerSlice.reducer
export type { FileNode }
