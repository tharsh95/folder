import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Base selectors
const selectUI = (state: RootState) => state.ui
const selectNodeId = (_state: RootState, nodeId: string) => nodeId

// Default values as constants to avoid creating new objects
const DEFAULT_SHOW_INPUT = { visible: false, isFolder: null }
const DEFAULT_SHOW_RENAME_INPUT = { visible: false, value: '' }

// Memoized selectors
export const selectIsNodeExpanded = createSelector(
  [selectUI, selectNodeId],
  (ui, nodeId) => ui.expandedNodes[nodeId] || false
)

export const selectShowInput = createSelector(
  [selectUI, selectNodeId],
  (ui, nodeId) => ui.showInput[nodeId] || DEFAULT_SHOW_INPUT
)

export const selectShowRenameInput = createSelector(
  [selectUI, selectNodeId],
  (ui, nodeId) => ui.showRenameInput[nodeId] || DEFAULT_SHOW_RENAME_INPUT
)