'use client';

import { useEffect } from 'react'
import { ChevronDown, ChevronRight, File as FileIcon, Folder as FolderIcon, Menu } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setData, setStatus } from '../store/slices/fileExplorerSlice'
import { setExpandedMany, setExpanded } from '../store/slices/uiSlice'

export default function Sidebar() {
  const dispatch = useAppDispatch()
  const tree = useAppSelector((state) => state.fileExplorer.data)
  const status = useAppSelector((state) => state.fileExplorer.status)
  const expanded = useAppSelector((state) => state.ui.expandedNodes)
  const selectedRootId = useAppSelector((state) => state.ui.selectedRootId)

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setStatus('loading'))
        const res = await fetch('/api/file-explorer', { cache: 'no-store' })
        const data = await res.json()
        dispatch(setData(data))
      } catch (e) {
        dispatch(setStatus('failed'))
      }
    }
    if (!tree && status !== 'loading') fetchData()
  }, [dispatch, tree, status])

  const roots = Array.isArray(tree) ? tree : []
  const selectedRoot = selectedRootId
    ? roots.find((r: any) => r.id === selectedRootId) || null
    : (roots[0] || null)
  const topLevelItems = selectedRoot ? [selectedRoot] : []

  const collectPathUntilFile = (node: any): string[] => {
    const path: string[] = []
    let cursor = node
    while (cursor && cursor.isFolder) {
      path.push(cursor.id)
      if (!cursor.items || cursor.items.length === 0) break
      const firstChild = cursor.items[0]
      if (!firstChild.isFolder) {
        // stop expansion before file; include current folder only
        break
      }
      cursor = firstChild
    }
    return path
  }

  const handleFolderClick = (node: any) => {
    if (!node.isFolder) return
    // If already expanded, collapse only this node
    if (expanded[node.id]) {
      dispatch(setExpanded({ nodeId: node.id, expanded: false }))
      return
    }
    const ids = collectPathUntilFile(node)
    if (ids.length) {
      dispatch(setExpandedMany({ ids, expanded: true }))
    }
  }

  const renderNode = (node: any) => {
    const isFolder = node.isFolder
    const hasChildren = (node.items?.length || 0) > 0
    return (
      <li key={node.id}>
        <div className={`flex items-center justify-between px-3 py-1 rounded hover:bg-slate-800`}
          onClick={() => handleFolderClick(node)}
        >
          <div className="flex items-center space-x-2">
            {isFolder ? <FolderIcon className="h-4 w-4 text-slate-300" /> : <FileIcon className="h-4 w-4 text-slate-300" />}
            <span className="text-slate-300 text-xs leading-tight truncate">{node.name}</span>
          </div>
        </div>
        {isFolder && hasChildren && expanded[node.id] && (
          <ul className="ml-4 mt-1 space-y-0.5">
            {node.items.map((child: any) => renderNode(child))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <div className="w-80 bg-slate-900 text-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">CLOIT</h1>
          <Menu className="h-6 w-6" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto text-xs">
        {status === 'loading' && !tree ? (
          <div className="text-slate-400 px-4">Loading...</div>
        ) : (
          <ul className="space-y-0.5">
            {topLevelItems.map((item: any) => renderNode(item))}
          </ul>
        )}
      </nav>
    </div>
  );
}

