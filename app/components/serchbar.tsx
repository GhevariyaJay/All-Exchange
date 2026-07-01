
export function Searchbar() {
    return (
        <div className="flex items-center">
            <input 
                type="text" 
                className="bg-white-800 text-black-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search..." 
            />
        </div>
    );
}