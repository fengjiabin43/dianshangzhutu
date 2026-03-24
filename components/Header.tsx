
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <i className="fa-solid fa-shirt text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              电商主图处理器
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
          </nav>
          <div>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors text-sm font-semibold">
              <i className="fa-solid fa-circle-question mr-2"></i>
              使用教程
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
