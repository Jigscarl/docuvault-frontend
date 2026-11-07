import {useState} from "react";
import {Folder,FolderPlus,Search,MoreVertical,FileText,Pencil,Trash2,X,} from "lucide-react";

const initialFolders = [
    {
        id: 1,
        name: "Projects",
        documents: 24,
        updated: "Today",
        color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-950",
    },
    {
        id:2,
        name:"Finance",
        documents: 12,
        updated: "Yesterday",
        color: "text-emeraid-500 bg-emeraid-100 dark:bg-emeraid-950"
    },
    {
        id:3,
        name: "Work Document",
        documents: 32,
        updated: "2 daya ago",
        color: "text-amber-500 bg-amber-100 dark:bg-amber-950"
    },
    {
        id:4,
        name:"Personal",
        documents:12,
        updated:"3 days ago",
        color:"text-purple-500 bg-purple-100 dark:bg-purple-950"
    },
    {
        id:5,
        name:"Images",
        documents:45,
        updated: "Last week",
        color: "text-pink-500 bg-pink-100 dark:bg-pink-950"
    },

];
export default  function Folders(){
    const [folders,setFolders] = useState(initialFolders);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [editingFolder, setEditingFolder] = useState(null);
    const [menuFolder, setMenuFolder] = useState(null);

    const filteredFolders = folders.filter((folder) => folder.name.toLowerCase().includes(search.toLowerCase()));

    function openCreateModal(){
        setEditingFolder(null);
        setFolderName("");
        setShowModal(true);
    }
    function openEditModal(folder){
        setEditingFolder(folder);
        setFolderName(folder.name);
        setShowModal(true);
        setMenuFolder(null);
    }
    function saveFolder(e){
        e.preventDefault();
        const name = folderName.trim();
        if (!name) return;
        const duplicate = folders.some(
            (folder) => folder.name.toLowerCase() === name.toLowerCase() && folder.id !== editingFolder?.id
        );

        if(duplicate){
            alert("A folder with this name already exists");
            return;
        }

        if (editingFolder){
            setFolders((current) => current.map((folder)=> folder.id === editingFolder.id ? {...folder,name} : folder));
        } else {
            setFolders((current)=>[
               { id: Date.now(),
                name,
                documents:0,
                updated: "just now",
                color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-950",
               },
               ...current,
            ]);
        }
        setFolderName("");
        setShowModal(false);
        setEditingFolder(null);

    }

    function deleteFolder(folder){
        const confirmed = window.confirm('Delete the folder "${folder.name}"?');

        if(confirmed){
            setFolders((current)=> current.filter((item)=>item.id !== folder.id));
        }
        setMenuFolder(null);
    }
    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row  sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-grey-900 dark:text-white">My folder</h1>
                    <p className="text-2xl font-bold text-gray-500 dark:text-grey-400">Organise and Manage Your Documents</p>
                </div>
                <button onClick = {openCreateModal} className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                    <FolderPlus size={18} />
                    Create Folder
                </button>
            </div>
            <div className="relative max-w-md">
                <Search size={18} className="absolute left-3 top-1/2-translate-y-1/2 text-gray-400"/>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search folders..." className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"/>
            </div>
            {filteredFolders.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredFolders.map((folder) => (
                        <div key={folder.id} className="relative rounded-xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="flext items-start justify-between">
                                <div className={'rounded-xl p-3 ${folder.color}'}>
                                    <Folder size={25}/>
                                </div>
                                <button onClick={() => setMenuFolder( menuFolder === folder.id ? null : folder.id)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <MoreVertical size={18}/>
                                </button>
                            </div>
                            {menuFolder === folder.id && (
                                <div className="absolute right-5 top-14 z-10 w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                                    <button onClick={() => openEditModal(folder)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                                        <Pencil size={15}/>
                                        Rename
                                    </button>
                                    <button onClick={() => deleteFolder(folder)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                                        <Trash2 size={15}/>
                                        Delete
                                    </button>
                                </div>
                            )}
                            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{folder.name}</h3>
                            <div className="mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1.5"><FileText size={15}/>
                                  {folder.documents} documents
                                </span>
                                <span>{folder.updated}</span>
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
                    <Folder size={40} className="mx-auto text-gray-400"/>
                    <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">No folders found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try another search or create a new folder</p>
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {editingFolder ? "Rename Folder" : "Create Folder"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={saveFolder} className="mt-5 space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Folder name
                                </label>
                                <input autoFocus type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Enter folder name" maxLength={60} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"/>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() =>setShowModal(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-300 dark:hover:bg-gray-800">
                                    Cancel
                                </button>
                                <button type="submit" disabled ={!folderName.trim()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
                                    {editingFolder ? "Save Changes" : "Create Folder"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )

}