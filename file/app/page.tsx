// "use client";
// import Explorer from "./components/Explorer";
// import { useAppSelector, useAppDispatch } from "./store/hooks";
// import { fetchTree, insertNodeThunk, updateNodeThunk, deleteNodeThunk } from "./store/slices/fileExplorerSlice";
// import { useEffect } from "react";

// export default function Home() {
//   const explorerData = useAppSelector((state) => state.fileExplorer.data);
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     dispatch(fetchTree());
//   }, [dispatch]);

//   const handleInsertNode = (folderId: string, item: string, isFolder: boolean) => {
//     dispatch(insertNodeThunk({ folderId, item, isFolder }));
//   };

//   const handleUpdateNode = (nodeId: string, newName: string) => {
//     dispatch(updateNodeThunk({ nodeId, newName }));
//   };

//   const handleDeleteNode = (nodeId: string) => {
//     dispatch(deleteNodeThunk({ nodeId }));
//   };

//   return (
//     <div>
//       {explorerData ? (
//         <Explorer 
//           handleInsertNode={handleInsertNode} 
//           handleUpdateNode={handleUpdateNode} 
//           handleDeleteNode={handleDeleteNode} 
//           data={explorerData} 
//         />
//       ) : (
//         <div className="p-4 text-gray-500">Loading...</div>
//       )}
//     </div>
//   );
// }
'use client';

import { useEffect } from 'react';
// import { useAppDispatch } from './lib/hooks';
// import { fetchHierarchicalMenus } from './store/menuSlice';
import Sidebar from './components/Sidebar';
import MenuHeader from './components/MenuHeader';
import MenuTree from './components/MenuTree';
import MenuDetails from './components/MenuDetails';

export default function Home() {
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(fetchHierarchicalMenus());
  // }, [dispatch]);

  return (
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <MenuHeader />

          {/* Content Area */}
          <div className="flex-1 flex flex-col md:flex-row overflow-auto md:overflow-hidden">
            {/* Menu Tree */}
            <div className="w-full md:w-1/2 bg-white">
              <MenuTree />
            </div>

            {/* Menu Details */}
            <div className="w-full md:w-1/2 bg-white md:border-l border-t md:border-t-0 border-gray-200">
              <MenuDetails />
            </div>
          </div>
        </div>
      </div>
  );
}
