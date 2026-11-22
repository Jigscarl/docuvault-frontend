import {useState,useCallback,useEffect} from "react";
import {Folder,FolderPlus,Search,MoreVertical,Loader2,Pencil,Trash2,} from "lucide-react";
import folderApi from "../../api/folderApi";

export default function Folders(){
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [editingFolder, setEditingFolder] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchFolders = useCallback(async() =>{
        try{
            setLoading(true);
            setError("");
            const data = await folderApi.getAll();
            setFolders(data);
        } catch(err){
            console.error("Folder retrieval failed:", err);
            setError(
                err.response?.data?.message || "Unable to load folders."
            );
        }
        finally{
            setLoading(false);
        }
    }, []);

    useEffect(() => {fetchFolders();}, [fetchFolders]);

    const openCreateModal = () =>{
        setEditingFolder(null);
        setFolderName("");
        setShowModal(true);
    };
    const openEditModal = (folder) =>{
        setEditingFolder(folder);
        setFolderName(folder.name);
        setShowModal(true);
    };
    const handleSave = async (event) => {
        event.preventDefault();
        if(!folderName.trim()) return;

        try{
            setSaving(true);
            setError("");

            if(editingFolder){
                await folderApi.rename(editingFolder.id, folderName.trim());
            } else {
                await folderApi.create(folderName.trim());
            }

            setShowModal(false);
            setFolderName("");
            setEditingFolder(null);
            await fetchFolders();
        } catch (err){
            console.error("Folder save Failed:", err);

            setError(
                err.response?.data?.message || "Unable to save folder."
            );
        } finally{setSaving(false);}
    };

    const handleDelete = async (folder) => {
        const confirmed = window.confirm(`Delete the folder "${folder.name}"? Documents inside will remain in Docuvault.`);
        if(!confirmed) return;

        try{
            setError("");
            await folderApi.delete(folder.id);
            await fetchFolders();
        } catch (err){console.error ("Folder delection failed:" , err);
            setError("Unable to delete folder.");
        }
    };
    const filteredFolders = folders.filter((folder) => folder.name.toLowerCase().includes(search.toLowerCase()));
    return (
        <div className = "space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Folders</h1>
                    <p className="mt-1 text-sm text-gray-500">Organize your documents into folders</p>
                </div>
                <button onClick ={openCreateModal} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700">
                    <FolderPlus size={18}/>
                </button>
            </div>
            <div className="relative  max-w-md">
                <Search size={18} className="absolute left-3 top-1/2-translate-y-1/2 text-gray-400"/>
                <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search folders..." className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"/>
            </div>
            {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                    {error}
                </div>
            )}
            {loading? (
                <div className="flex justify-center py-16">
                    <Loader2 className="animate-spin text-indigo-600" size={32}/>
                </div>
            ): filteredFolders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
                    <Folder size={42} className="mx-auto mb-3 text-gray-400"/>
                    <h3 className="font-semibold text-gray-900 dark:text-white">No folders found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Create a folder to organize your documents.
                    </p>
                </div>
            ): (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredFolders.map((folder) => (
                        <div key={folder.id} className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                            <div className="flex items-start justify-between">
                                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                  <Folder size={24}/>
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={() => openEditModal(folder)} title="Rename folder" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <Pencil size={16}/>
                                    </button>
                                    <button onClick={() => handleDelete(folder)} title="Delete folder" className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>

                            <h3 className="mt-4 truncate font-semibold text-gray-900 dark:text-white">
                                {folder.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">{folder.documentCount} documents</p>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <form onSubmit={handleSave} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editingFolder ? "Rename Folder" : "Create Folder"}</h2>
                        <input
                            autoFocus
                            type="text"
                            value={folderName}
                            onChange={(event) => setFolderName(event.target.value)}
                            placeholder="Enter folder name"
                            maxLength={100}
                            required
                            className="mt-5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none dark:bg-gray-800 dark:text-white"
                        />
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                disabled={saving}
                                className="rounded-xl px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving || !folderName.trim()}
                                className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {saving ? "Saving..." : editingFolder ? "Save Changes" : "Create Folder"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
