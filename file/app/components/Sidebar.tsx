'use client';

import { useEffect } from 'react'
import {  File as FileIcon, Folder as FolderIcon, Menu } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setData, setStatus } from '../store/slices/fileExplorerSlice'

export default function Sidebar() {
  const dispatch = useAppDispatch()
  const tree = useAppSelector((state) => state.fileExplorer.data)
  const status = useAppSelector((state) => state.fileExplorer.status)
  const expanded = useAppSelector((state) => state.ui.expandedNodes)
  const selectedRootId = useAppSelector((state) => state.ui.selectedRootId)

  const selectedNodeId = useAppSelector((state) => state.ui.selectedNodeId)
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
  

  const renderNode = (node: any) => {
    const isFolder = node.isFolder
    const hasChildren = (node.items?.length || 0) > 0
    const isSelected = selectedNodeId === node.id
    return (
      <li key={node.id}>
        <div className={`flex items-center justify-between px-3 py-1 rounded ${isSelected ? 'bg-[#9FF442] ring-1 ring-slate-600' : ''}`}>
          <div className="flex items-center space-x-2">
            {isFolder 
              ? <FolderIcon className={`h-4 w-4 ${isSelected ? 'text-black' : 'text-slate-300'}`} /> 
              : <FileIcon className={`h-4 w-4 ${isSelected ? 'text-black' : 'text-slate-300'}`} />}
            <span className={`text-xs leading-tight truncate ${isSelected ? 'text-black font-medium' : 'text-slate-300'}`}>{node.name}</span>
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

