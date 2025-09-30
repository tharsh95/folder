'use client';

import Sidebar from './components/Sidebar';
import MenuHeader from './components/MenuHeader';
import MenuTree from './components/MenuTree';
import MenuDetails from './components/MenuDetails';

export default function Home() {
  return (
      <div className="flex h-screen bg-gray-50">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <MenuHeader />
          <div className="flex-1 flex flex-col md:flex-row overflow-auto md:overflow-hidden">
            <div className="w-full md:w-1/2 bg-white">
              <MenuTree />
            </div>
            <div className="w-full md:w-1/2 bg-white md:border-l border-t md:border-t-0 border-gray-200">
              <MenuDetails />
            </div>
          </div>
        </div>
      </div>
  );
}
