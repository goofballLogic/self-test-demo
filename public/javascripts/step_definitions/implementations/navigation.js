export function goHome() {
    const url = new URL(location.href);
    if (url.pathname !== "/") {
        url.pathname = "/";
        history.replaceState(null, null, url.toString());
    }
    document.dispatchEvent(new CustomEvent("reload-app"));
}