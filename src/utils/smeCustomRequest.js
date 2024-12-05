
function smeCustomRequest(path, method = "POST", body = {}) {

    let headers = {
        "token": localStorage.getItem("token") ?? "",
        "userId": localStorage.getItem('id') ?? "",
        "content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token") ?? "",
        "token":  localStorage.getItem("token") ?? ""
    }

    let options = {
        method: method,
        headers: headers,
    }

    if (method === "POST") {
        options['body'] = JSON.stringify(body)
    }

    return fetch(`https://platform-prod.arivihan.com/internal-metrics${path}`, options)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else if (res.status === 401) {
                console.log(res);
                return res.json();
            }
        })
        .then(json => {
            return json;
        })
}


export {
    smeCustomRequest
}

