'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, FilePlus, FolderPlus, Pencil, Trash2 } from 'lucide-react';
import { 
  optimisticCreateNode, 
  optimisticUpdateNode, 
  optimisticDeleteNode,
  createNode,
  updateNode,
  deleteNode
} from '../store/slices/fileExplorerSlice'
import { setSelectedNodeId } from '../store/slices/uiSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setExpanded } from '../store/slices/uiSlice';
import { useFileExplorer } from '../hooks/useFileExplorer';

interface MenuTreeItemProps {
  menu: any;
  level: number;
  ancestors?: boolean[]; // for each ancestor: true if that ancestor has more siblings after it
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function MenuTreeItem({ menu, level, ancestors = [], selectedId, onSelect }: MenuTreeItemProps) {
  const dispatch = useAppDispatch();
  const expandedNodes = useAppSelector((state) => state.ui.expandedNodes);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addName, setAddName] = useState('');
  const [addIsFolder, setAddIsFolder] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(menu.name);

  const isExpanded = !!expandedNodes[menu.id];
  const hasChildren = Array.isArray(menu.items) && menu.items.length > 0;
  const isFolder = !!menu.isFolder;
  const isSelected = selectedId === menu.id;

  const handleToggle = () => {
    dispatch(setExpanded({ nodeId: menu.id, expanded: !isExpanded }));
  };

  return (
    <div className="select-none">
      <div className="flex items-start">
        {/* Draw vertical guides for each ancestor that still has following siblings */}
        {ancestors.map((hasMore, idx) => (
          <div key={idx} className="relative w-6">
            {hasMore && (
              <div className="absolute left-3 top-0 bottom-0 border-l border-gray-500"></div>
            )}
          </div>
        ))}
        {level > 0 && (
          <div className="relative w-6">
            {/* Vertical line from parent to this node; continue below if not last at this level */}
            {/** If this node is last among its siblings, only draw down to the elbow (h-4). Otherwise, full height. */}
            {/* This is handled by the parent when passing ancestors; here we always draw from top to elbow */}
            <div className="absolute left-3 top-0 h-3 border-l border-gray-500"></div>
            <div className="absolute left-3 top-3 w-2 border-t border-gray-500"></div>
          </div>
        )}
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer rounded w-full ${isSelected ? 'bg-blue-50 ring-1 ring-blue-200' : ''}`}
          style={{ paddingLeft: `${level === 0 ? 8 : 0}px` }}
        >
          {/* Expand/Collapse Button */}
          {isFolder ? (
            <button
              onClick={handleToggle}
              className="mr-2 p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-6 mr-2" />
          )}

          {/* Menu Name */}
          <span
            className={`flex-1 text-sm ${isSelected ? 'text-blue-700 font-medium' : ''}`}
            onClick={() => {
              if (isFolder) {
                handleToggle();
              }
              onSelect(menu.id);
            }}
          >
            {isEditing ? (
              <input
                className="border border-gray-300 rounded px-1 py-0.5 text-sm"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && editName.trim()) {
                    const newName = editName.trim();
                    // Optimistic update
                    dispatch(optimisticUpdateNode({ id: menu.id, name: newName }));
                    setIsEditing(false);
                    
                    // API call
                    dispatch(updateNode({ nodeId: menu.id, name: newName }));
                  }
                  if (e.key === 'Escape') setIsEditing(false)
                }}
                onBlur={() => setIsEditing(false)}
                autoFocus
              />
            ) : (
              menu.name
            )}
          </span>

          {selectedId === menu.id && (
            <div className="flex items-center space-x-2">
              {menu.isFolder && (
                <>
                  <button className="p-1 rounded hover:bg-gray-200" title="Add Folder" onClick={() => { setAddIsFolder(true); setShowAddForm(true); setAddName('') }}>
                    <FolderPlus className="h-4 w-4 text-gray-700" />
                  </button>
                  <button className="p-1 rounded hover:bg-gray-200" title="Add File" onClick={() => { setAddIsFolder(false); setShowAddForm(true); setAddName('') }}>
                    <FilePlus className="h-4 w-4 text-gray-700" />
                  </button>
                </>
              )}
              <button className="p-1 rounded hover:bg-gray-200" title="Edit" onClick={() => { setIsEditing(true); setEditName(menu.name) }}>
                <Pencil className="h-4 w-4 text-gray-700" />
              </button>
              <button className="p-1 rounded hover:bg-red-100" title="Delete" onClick={() => {
                // Optimistic update
                dispatch(optimisticDeleteNode({ id: menu.id }));
                // API call
                dispatch(deleteNode(menu.id));
              }}>
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="ml-10 mt-1">
          <div className="flex items-center space-x-2">
            <input
              className="border border-blue-400 rounded px-2 py-1 text-sm"
              placeholder="New item name"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && addName.trim()) {
                  const tempId = `temp-${Date.now()}`;
                  const itemName = addName.trim();
                  
                  // Optimistic update
                  dispatch(optimisticCreateNode({ 
                    id: tempId, 
                    parentId: menu.id, 
                    name: itemName, 
                    isFolder: addIsFolder 
                  }));
                  
                  setAddName('');
                  setShowAddForm(false);
                  
                  // API call
                  dispatch(createNode({ 
                    parentId: menu.id, 
                    name: itemName, 
                    isFolder: addIsFolder 
                  }));
                }
                if (e.key === 'Escape') setShowAddForm(false)
              }}
              autoFocus
            />
            <button
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
              onClick={() => {
                if (addName.trim()) {
                  const tempId = `temp-${Date.now()}`;
                  const itemName = addName.trim();
                  
                  // Optimistic update
                  dispatch(optimisticCreateNode({ 
                    id: tempId, 
                    parentId: menu.id, 
                    name: itemName, 
                    isFolder: addIsFolder 
                  }));
                  
                  setAddName('');
                  setShowAddForm(false);
                  
                  // API call
                  dispatch(createNode({ 
                    parentId: menu.id, 
                    name: itemName, 
                    isFolder: addIsFolder 
                  }));
                }
              }}
            >Add</button>
            <button className="px-2 py-1 text-xs bg-gray-200 rounded" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Children */}
      {isExpanded && hasChildren && (
        <ul className="ml-4">
          {menu.items?.map((child: any, index: number) => {
            const isLast = index === (menu.items.length - 1)
            const nextAncestors = [...ancestors]
            if (level > 0 || ancestors.length > 0 || true) {
              nextAncestors.push(!isLast)
            }
            return (
              <li key={child.id} className="relative">
                {/* If not last, draw continuation line behind the child column */}
                <MenuTreeItem
                  menu={child}
                  level={level + 1}
                  ancestors={nextAncestors}
                  selectedId={selectedId}
                  onSelect={onSelect}
                />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  );
}

export default function MenuTree() {
  const { data: tree, isLoading } = useFileExplorer();
  const selectedRootId = useAppSelector((state) => state.ui.selectedRootId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  
  if (isLoading || !tree) {
    return (
      <div className="p-4">
        <div className="animate-pulse">Loading menus...</div>
      </div>
    );
  }

  return (
    <div className="border-r md:border-r border-gray-200 h-full overflow-y-auto p-3 md:p-0">
      {(Array.isArray(tree) ? tree : [])
        .filter((root: any) => {
          if (selectedRootId) return root.id === selectedRootId;
          const firstId = (Array.isArray(tree) && tree[0]) ? tree[0].id : null;
          return root.id === firstId;
        })
        .map((menu: any) => (
        <MenuTreeItem
          key={menu.id}
          menu={menu}
          level={0}
          selectedId={selectedId}
          onSelect={(id) => { setSelectedId(id); dispatch(setSelectedNodeId(id)) }}
        />
      ))}
    </div>
  );
}
