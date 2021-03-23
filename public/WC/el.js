export default function el(tag) {
    tag = tag.split(".");
    const x = document.createElement(tag[0]);
    for (var i = 1; i < tag.length; i++) {
        x.classList.add(tag[i]);
    }
    for (var i = 1; i < arguments.length; i++) {
        const y = arguments[i];
        if (typeof y !== "string") {
            x.appendChild(y);
        } else {
            x.innerHTML = x.innerHTML + y;
        }
    }
    return x;
}