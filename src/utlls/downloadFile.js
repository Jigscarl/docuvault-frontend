import documentApi from "../api/documentApi";

function triggerDownload(url, fileName) {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "document";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
}

export async function downloadFile(documentOrId, fileName){
    try{
        const documentData = typeof documentOrId === "object" && documentOrId !== null ? documentOrId : null;
        const resolvedName = fileName || documentData?.name || "document";

        if (documentData?.file instanceof File) {
            triggerDownload(URL.createObjectURL(documentData.file), resolvedName);
            return;
        }

        if (documentData?.url) {
            triggerDownload(documentData.url, resolvedName);
            return;
        }

        const documentId = documentData?.id ?? documentOrId;
        const result = documentApi.download ? await documentApi.download(documentId) : null;

        if (result?.url) {
            triggerDownload(result.url, resolvedName);
            return;
        }

        if (result instanceof Blob) {
            triggerDownload(URL.createObjectURL(result), resolvedName);
            return;
        }

        const fallback = new Blob([
            JSON.stringify({
                id: documentId,
                name: resolvedName,
                downloadedAt: new Date().toISOString(),
            }, null, 2),
        ], { type: "text/plain;charset=utf-8" });

        triggerDownload(URL.createObjectURL(fallback), resolvedName.endsWith(".txt") ? resolvedName : `${resolvedName}.txt`);
    }
    catch (error){
        console.error("Download failed:", error);

        const message = error?.response?.data?.message || error?.message || "Unable to download this document. Please try again.";
        alert(message);
    }
}