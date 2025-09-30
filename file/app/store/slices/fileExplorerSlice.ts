import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

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
  optimisticUpdates: {
    [operationId: string]: {
      type: 'create' | 'update' | 'delete';
      tempId?: string;
      realId?: string;
      parentId?: string;
      data: Partial<FileNode>;
    };
  };
}

const initialState: FileExplorerState = {
  data: null,
  status: 'idle',
  optimisticUpdates: {}
}

// Helper function to find and update a node in the tree
const updateNodeInTree = (tree: FileNode[], nodeId: string, updates: Partial<FileNode>): FileNode[] => {
  return tree.map(node => {
    if (node.id === nodeId) {
      return { ...node, ...updates };
    }
    if (node.items) {
      return { ...node, items: updateNodeInTree(node.items, nodeId, updates) };
    }
    return node;
  });
};

// Helper function to add a node to the tree
const addNodeToTree = (tree: FileNode[], parentId: string, newNode: FileNode): FileNode[] => {
  if (parentId === 'root') {
    return [...tree, newNode];
  }
  return tree.map(node => {
    if (node.id === parentId) {
      return { ...node, items: [...(node.items || []), newNode] };
    }
    if (node.items) {
      return { ...node, items: addNodeToTree(node.items, parentId, newNode) };
    }
    return node;
  });
};

// Helper function to remove a node from the tree
const removeNodeFromTree = (tree: FileNode[], nodeId: string): FileNode[] => {
  return tree.filter(node => {
    if (node.id === nodeId) return false;
    if (node.items) {
      node.items = removeNodeFromTree(node.items, nodeId);
    }
    return true;
  });
};

// Async thunks for API calls
export const fetchTreeData = createAsyncThunk(
  'fileExplorer/fetchTreeData',
  async () => {
    const response = await fetch('/api/file-explorer');
    if (!response.ok) {
      throw new Error('Failed to fetch tree data');
    }
    return response.json();
  }
);

export const createRootNode = createAsyncThunk(
  'fileExplorer/createRootNode',
  async (name: string, { dispatch }) => {
    const response = await fetch('/api/file-explorer/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!response.ok) {
      throw new Error('Failed to create root node');
    }
    return response.json();
  }
);

export const createNode = createAsyncThunk(
  'fileExplorer/createNode',
  async ({ parentId, name, isFolder }: { parentId: string; name: string; isFolder: boolean }, { dispatch }) => {
    const response = await fetch('/api/file-explorer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderId: parentId, item: name, isFolder })
    });
    if (!response.ok) {
      throw new Error('Failed to create node');
    }
    return response.json();
  }
);

export const updateNode = createAsyncThunk(
  'fileExplorer/updateNode',
  async ({ nodeId, name }: { nodeId: string; name: string }, { dispatch }) => {
    const response = await fetch(`/api/file-explorer/${nodeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!response.ok) {
      throw new Error('Failed to update node');
    }
    return response.json();
  }
);

export const deleteNode = createAsyncThunk(
  'fileExplorer/deleteNode',
  async (nodeId: string, { dispatch }) => {
    const response = await fetch(`/api/file-explorer/${nodeId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete node');
    }
    return response.json();
  }
);

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
    },
    // Optimistic update actions
    optimisticCreateRoot: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const { id, name } = action.payload;
      const operationId = `create-root-${id}`;
      
      if (state.data) {
        const newNode: FileNode = {
          id,
          name,
          isFolder: true,
          items: []
        };
        state.data = [...state.data, newNode];
      }
      
      state.optimisticUpdates[operationId] = {
        type: 'create',
        tempId: id,
        data: { id, name, isFolder: true, items: [] }
      };
    },
    optimisticCreateNode: (state, action: PayloadAction<{ id: string; parentId: string; name: string; isFolder: boolean }>) => {
      const { id, parentId, name, isFolder } = action.payload;
      const operationId = `create-${id}`;
      
      if (state.data) {
        const newNode: FileNode = {
          id,
          name,
          isFolder,
          items: []
        };
        state.data = addNodeToTree(state.data, parentId, newNode);
      }
      
      state.optimisticUpdates[operationId] = {
        type: 'create',
        tempId: id,
        parentId,
        data: { id, name, isFolder, items: [] }
      };
    },
    optimisticUpdateNode: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const { id, name } = action.payload;
      const operationId = `update-${id}`;
      
      if (state.data) {
        state.data = updateNodeInTree(state.data, id, { name });
      }
      
      state.optimisticUpdates[operationId] = {
        type: 'update',
        data: { id, name }
      };
    },
    optimisticDeleteNode: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const operationId = `delete-${id}`;
      
      if (state.data) {
        state.data = removeNodeFromTree(state.data, id);
      }
      
      state.optimisticUpdates[operationId] = {
        type: 'delete',
        data: { id }
      };
    },
    syncWithServer: (state, action: PayloadAction<FileNode[]>) => {
      state.data = action.payload;
      state.optimisticUpdates = {};
    },
    revertOptimisticUpdate: (state, action: PayloadAction<{ operationId: string }>) => {
      const { operationId } = action.payload;
      delete state.optimisticUpdates[operationId];
      // Note: In a real app, you'd want to revert the specific change
      // For simplicity, we'll just clear the optimistic updates
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTreeData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTreeData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = undefined;
      })
      .addCase(fetchTreeData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createRootNode.fulfilled, (state, action) => {
        // Clear optimistic updates and sync with server response
        state.optimisticUpdates = {};
        state.data = action.payload;
      })
      .addCase(createRootNode.rejected, (state, action) => {
        // Revert optimistic updates on failure
        state.optimisticUpdates = {};
        state.error = action.error.message;
      })
      .addCase(createNode.fulfilled, (state, action) => {
        state.optimisticUpdates = {};
        state.data = action.payload;
      })
      .addCase(createNode.rejected, (state, action) => {
        state.optimisticUpdates = {};
        state.error = action.error.message;
      })
      .addCase(updateNode.fulfilled, (state, action) => {
        state.optimisticUpdates = {};
        state.data = action.payload;
      })
      .addCase(updateNode.rejected, (state, action) => {
        state.optimisticUpdates = {};
        state.error = action.error.message;
      })
      .addCase(deleteNode.fulfilled, (state, action) => {
        state.optimisticUpdates = {};
        state.data = action.payload;
      })
      .addCase(deleteNode.rejected, (state, action) => {
        state.optimisticUpdates = {};
        state.error = action.error.message;
      });
  }
})

export const { 
  setData, 
  setStatus, 
  setError, 
  optimisticCreateRoot, 
  optimisticCreateNode, 
  optimisticUpdateNode, 
  optimisticDeleteNode, 
  syncWithServer, 
  revertOptimisticUpdate 
} = fileExplorerSlice.actions
export default fileExplorerSlice.reducer
export type { FileNode }
