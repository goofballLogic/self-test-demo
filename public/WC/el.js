export default function el(tag) {
    let id = null;
    tag = tag.split(".").map(x => {
        const hashIndex = x.indexOf("#");
        if (hashIndex < 0) return x;
        id = x.substring(hashIndex + 1);
        return x.substring(0, hashIndex);
    });
    const x = document.createElement(tag[0]);
    if (id) x.setAttribute("id", id);
    for (var i = 1; i < tag.length; i++) {
        x.classList.add(tag[i]);
    }
    for (var i = 1; i < arguments.length; i++) {
        const y = arguments[i];
        if (typeof y === "string") {
            x.innerHTML = x.innerHTML + y;
        } else if (Array.isArray(y)) {
            for (let z of y)
                x.appendChild(z);
        } else {
            x.appendChild(y);
        }
    }
    return x;
}