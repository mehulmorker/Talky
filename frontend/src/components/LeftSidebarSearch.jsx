import { HiOutlineSearch } from "react-icons/hi";

export const LeftSidebarSearch = () => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="relative">
        <input
          type="text"
          placeholder="Search your talky..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          disabled
        />
        <HiOutlineSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};
