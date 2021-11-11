let globalName = prompt("Qual o seu nome?");

enterChat();

function enterChat() {

    let name = globalName;
    axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", { name }).then(success(name)).catch(error);
}

function success(name) {
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", { name });

    setInterval(connection, 5000, name);
}

function error() {
    globalName = prompt("Seu nome já existe no servidor! Por favor, digite outro.");

    enterChat();
}

function connection(name) {
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", { name });
}


requestMessages();

setInterval(requestMessages, 1000);
setInterval(requestParticipants, 1000);

function requestMessages() {
    axios.get("https://mock-api.driven.com.br/api/v4/uol/messages").then(loadMessages);
}

function loadMessages(answer) {
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

        if (answer.data[i].type == "private_message" && answer.data[i].from == globalName) {
            document.querySelector(".chat").innerHTML +=
                `<div class="message ${answer.data[i].type}" data-identifier="message">
                ${answer.data[i].time} <strong> ${answer.data[i].from}</strong> reservadamente para <strong>${answer.data[i].to}</strong>: ${answer.data[i].text}
            </div>`
        }
    }

    document.querySelector(".chat .message:last-child").scrollIntoView();
}

function requestParticipants() {
    axios.get("https://mock-api.driven.com.br/api/v4/uol/participants").then(participants);
}

function participants(answer) {
    console.log(answer.data[0]); // bônus 
}


function sendMessage() {
    axios.post("https://mock-api.driven.com.br/api/v4/uol/messages",
        {
            from: globalName,
            to: "Todos",
            text: document.querySelector("input").value,
            type: "message"
        });

    requestMessages();

    document.querySelector("input").value = ''; iha
}

function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("active");
    document.querySelector(".sidebar-background").classList.toggle("active");
}