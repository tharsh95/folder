'use client';

import { Folder, Grid, ChevronDown } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setExpandedMany, setSelectedRootId } from '../store/slices/uiSlice';

export default function MenuHeader() {
  const dispatch = useAppDispatch();
  const tree = useAppSelector((state) => state.fileExplorer.data);
  const selectedRootId = useAppSelector((state) => state.ui.selectedRootId);

  const roots = useMemo(() => (Array.isArray(tree) ? tree.filter((r: any) => r.isFolder) : []), [tree]);

  useEffect(() => {
    if (!selectedRootId && roots.length > 0) {
      dispatch(setSelectedRootId(roots[0].id));
    }
  }, [selectedRootId, roots, dispatch]);

  const collectFolderIds = (node: any | null | undefined, acc: string[] = []): string[] => {
    if (!node) return acc;
    if (Array.isArray(node)) {
      node.forEach((n) => collectFolderIds(n, acc));
      return acc;
    }
    if (node.isFolder) acc.push(node.id);
    if (Array.isArray(node.items)) {
      node.items.forEach((child: any) => collectFolderIds(child, acc));
    }
    return acc;
  };

  const handleExpandAll = () => {
    const ids = collectFolderIds(tree);
    if (ids.length) dispatch(setExpandedMany({ ids, expanded: true }));
  };

  const handleCollapseAll = () => {
    const ids = collectFolderIds(tree);
    if (ids.length) dispatch(setExpandedMany({ ids, expanded: false }));
  };

  return (
    <div className="border-b border-gray-200 p-4 md:p-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <Folder className="h-4 w-4" />
        <span>Menus</span>
      </div>

      {/* Title */}
      <div className="flex items-center space-x-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
          <Grid className="h-5 w-5 md:h-6 md:w-6 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Menus</h1>
      </div>

      {/* Menu Selection */}
      <div className="mb-4 md:mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Menu
        </label>
        <div className="relative">
          <select
            className="w-full max-w-xs px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedRootId ?? (roots[0]?.id ?? '')}
            onChange={(e) => dispatch(setSelectedRootId(e.target.value || null))}
          >
            {roots.map((root: any) => (
              <option key={root.id} value={root.id}>{root.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleExpandAll}
          className="px-3 md:px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm md:text-base"
        >
          Expand All
        </button>
        <button
          onClick={handleCollapseAll}
          className="px-3 md:px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm md:text-base"
        >
          Collapse All
        </button>
      </div>
    </div>
  );
}

