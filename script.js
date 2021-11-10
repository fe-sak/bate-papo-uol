function serverRequest() {
    axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages").then(load);
}

serverRequest();

setInterval(serverRequest, 3000);

function load(answer) {
    document.querySelector(".chat").innerHTML = "";

    for (let i = 0; i < answer.data.length; i++) {
        if (answer.data[i].type == "status") {
            document.querySelector(".chat").innerHTML +=
                `<div class="message ${answer.data[i].type}" data-identifier="message">
                ${answer.data[i].time} <strong> ${answer.data[i].from} </strong> ${answer.data[i].text}
            </div>`
        }

        if (answer.data[i].type == "message") {
            document.querySelector(".chat").innerHTML +=
                `<div class="message ${answer.data[i].type}" data-identifier="message">
                ${answer.data[i].time} <strong> ${answer.data[i].from}</strong> para <strong>${answer.data[i].to}</strong>: ${answer.data[i].text}
            </div>`
        }

        if (answer.data[i].type == "private_message") {
            document.querySelector(".chat").innerHTML +=
                `<div class="message ${answer.data[i].type}" data-identifier="message">
                ${answer.data[i].time} <strong> ${answer.data[i].from}</strong> reservadamente para <strong>${answer.data[i].to}</strong>: ${answer.data[i].text}
            </div>`
        }
    }

    document.querySelector(".chat .message:last-child").scrollIntoView();
}

function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("active");
    document.querySelector(".sidebar-background").classList.toggle("active");
}