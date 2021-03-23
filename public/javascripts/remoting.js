export function server(description, parameterSupplier) {
    return async function () {

        const additionalArguments = parameterSupplier ? await parameterSupplier() : [];
        const payload = JSON.stringify({
            description,
            context: this,
            params: Array.from(arguments).concat(additionalArguments)
        });
        const resp = await fetch("/features/run-step", {
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
            body: payload
        });
        if (!resp.ok) {
            throw new Error("An error occurred trying to run this step on the server");
        }
        const json = await resp.json();
        if (json.error) throw new Error(`Server ${json.error}\n----`);
        Object.assign(this, json.context);
    }
}