import { configureStore } from '@reduxjs/toolkit'
import fileExplorerReducer from './slices/fileExplorerSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    fileExplorer: fileExplorerReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
