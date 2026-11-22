import documentApi from "../api/documentApi";

export async function downloadFile(documentId, fileName){
    try{
        const result = await documentApi.download(documentId);

        if(!result.url){
            throw new Error("Download URL was not returned.");
        }
        const link = document.createElement("a");
        link.href = result.url;
        link.download = fileName || "document";
        link.target = "blank";
        link.rel = "noopener noreferrer";

        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    catch (error){
        console.error("Download failed:", error);

        alert(error.response?.data?.message || "Unable to download this document.");

    }
    
    
}