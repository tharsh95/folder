import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  expandedNodes: { [nodeId: string]: boolean };
  showInput: { [nodeId: string]: { visible: boolean; isFolder: boolean | null } };
  showRenameInput: { [nodeId: string]: { visible: boolean; value: string } };
  selectedNodeId?: string | null;
  selectedRootId?: string | null;
}

const initialState: UIState = {
  expandedNodes: {},
  showInput: {},
  showRenameInput: {},
  selectedNodeId: null,
  selectedRootId: null
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleNode: (state, action: PayloadAction<{ nodeId: string }>) => {
      const { nodeId } = action.payload
      state.expandedNodes[nodeId] = !state.expandedNodes[nodeId]
    },
    setExpanded: (state, action: PayloadAction<{ nodeId: string; expanded: boolean }>) => {
      const { nodeId, expanded } = action.payload
      state.expandedNodes[nodeId] = expanded
    },
    setExpandedMany: (state, action: PayloadAction<{ ids: string[]; expanded: boolean }>) => {
      const { ids, expanded } = action.payload
      ids.forEach((id) => { state.expandedNodes[id] = expanded })
    },
    setSelectedNodeId: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload
    },
    setSelectedRootId: (state, action: PayloadAction<string | null>) => {
      state.selectedRootId = action.payload
    },
    setShowInput: (state, action: PayloadAction<{ nodeId: string; visible: boolean; isFolder: boolean | null }>) => {
      const { nodeId, visible, isFolder } = action.payload
      state.showInput[nodeId] = { visible, isFolder }
    },
    setShowRenameInput: (state, action: PayloadAction<{ nodeId: string; visible: boolean; value: string }>) => {
      const { nodeId, visible, value } = action.payload
      state.showRenameInput[nodeId] = { visible, value }
    },
    updateRenameValue: (state, action: PayloadAction<{ nodeId: string; value: string }>) => {
      const { nodeId, value } = action.payload
      if (state.showRenameInput[nodeId]) {
        state.showRenameInput[nodeId].value = value
      }
    }
  }
})

export const { toggleNode, setExpanded, setExpandedMany, setSelectedNodeId, setSelectedRootId, setShowInput, setShowRenameInput, updateRenameValue } = uiSlice.actions
export default uiSlice.reducer
