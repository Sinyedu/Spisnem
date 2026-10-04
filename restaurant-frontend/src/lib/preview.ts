//need a way to go around the construction page.

const STORAGE_KEY = "spisnem:preview";
const SECRET = "Skipping_construction_page"

function greenFlag(): boolean {
    try{
        const value = new URLSearchParams(window.location.search).get("preview");
        if (value === SECRET) localStorage.setItem(STORAGE_KEY, "1");
        if (value === "off") localStorage.removeItem(STORAGE_KEY);
        return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
        return false;
    }

}
export const previewEnabled = greenFlag();
