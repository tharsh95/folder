'use client';

import { useMemo } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { useAppSelector } from '../store/hooks';

export default function MenuDetails() {
  const selectedId = useAppSelector((s) => s.ui.selectedNodeId)
  const tree = useAppSelector((s) => s.fileExplorer.data)
  const selectedRootId = useAppSelector((s) => s.ui.selectedRootId)

  type DetailInfo = { id: string; name: string; depth: number; parentName: string }

  const details = useMemo<DetailInfo | null>(() => {
    if (!tree || !selectedId) return null
    const roots = Array.isArray(tree) ? tree : []
    const searchRoots = selectedRootId
      ? roots.filter((r: any) => r.id === selectedRootId)
      : (roots.length ? [roots[0]] : [])

    let result: DetailInfo | null = null

    const dfs = (node: any, d: number, p: any, rootName: string) => {
      if (result) return
      if (node.id === selectedId) {
        result = {
          id: node.id,
          name: node.name,
          depth: d,
          parentName: p?.name || rootName || 'Root'
        }
        return
      }
      for (const child of node.items || []) dfs(child, d + 1, node, rootName)
    }

    for (const root of searchRoots) {
      dfs(root, 0, null, root?.name)
      if (result) break
    }

    return result
  }, [tree, selectedId, selectedRootId])

  if (!details) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Select a menu item to view details</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Menu Details</h2>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {/* Menu ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Menu ID
            </label>
            <input
              type="text"
              value={details.id}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
            />
          </div>

          {/* Depth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Depth
            </label>
            <input
              type="text"
              value={details.depth}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
            />
          </div>

          {/* Parent Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Data
            </label>
            <input
              type="text"
              value={details.parentName}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={details.name}
              className="w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              
              placeholder="Enter menu name"
              readOnly
            />
          </div>

          {/* Action Buttons - disabled for now */}
          <div className="flex space-x-3 pt-4"></div>
        </form>
      </div>
    </div>
  );
}

