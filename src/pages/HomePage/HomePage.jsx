import React from "react";

const HomePage = () => {
  return (
    <div className="p-8">
      <div className="bg-black rounded-lg shadow-sm border-2 border-dashed border-gray-300 h-96 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-plus-circle text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Welcome to yo 
          </h3>
          <p className="text-gray-500">
            This is where you content will appear.
          </p>
          <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
