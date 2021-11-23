let globalName = "";
let globalTo = "Todos";
let globalType = "message"

function getName() {
    globalName = document.querySelector(".enter-chat input").value;

    enterChat();
}

document.querySelector(".enter-chat input").addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();

        document.querySelector(".enter-chat button").click();
    }
})


function enterChat() {
    axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", { name: globalName }).then(success).catch(error);
}

function success() {
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", { name: globalName });

    document.querySelector(".enter-chat").innerHTML =
        `
        <img src="assets/logo 2.png" class="logo">
        <img src="assets/iPhone_8_-_4.png" class="loading">
        <span>Entrando</span>
    `;

    setTimeout(() => {
        document.querySelector(".enter-chat").classList.add("display-none");
    }, 1500);

    setInterval(connection, 5000);
}

function error() {
    alert("Seu nome já existe no servidor! Por favor, digite outro.");

    document.querySelector(".enter-chat input").value = "";
}

function connection() {
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", { name: globalName });
}


requestMessages();
requestParticipants();
let autoScroll = setInterval(requestMessages, 3000);
setInterval(requestParticipants, 10000);

function requestMessages() {
    axios.get("https://mock-api.driven.com.br/api/v4/uol/messages").then(loadMessages);
}

function loadMessages(answer) {
    lastMessage = document.querySelector(".message:last-of-type");
    document.querySelector(".chat").innerHTML = `<ion-icon onclick="toggleAutoScroll(this)" class="on" name="refresh-circle"></ion-icon>`;

    for (let i = 0; i < answer.data.length; i++) {
        let time = answer.data[i].time.slice(0, 2);

        time = parseInt(time);
        time += 9;
        if (time > 24) time -= 24;
        time = time.toString();
        time = time.concat(answer.data[i].time.slice(2,));
        if (answer.data[i].type == "status") {
            document.querySelector(".chat").innerHTML +=
                `<div class="message ${answer.data[i].type}" data-identifier="message">
                ${time} <strong> ${answer.data[i].from} </strong> ${answer.data[i].text}
            </div>`;
        }

        if (answer.data[i].type == "message") {
            document.querySelector(".chat").innerHTML +=
                `<div class="message ${answer.data[i].type}" data-identifier="message">
                ${time} <strong> ${answer.data[i].from}</strong> para <strong>${answer.data[i].to}</strong>: ${answer.data[i].text}
            </div>`;
        }

        if (answer.data[i].type == "private_message" && (answer.data[i].from == globalName || answer.data[i].to == globalName)) {
            document.querySelector(".chat").innerHTML +=
                `<div class="message ${answer.data[i].type}" data-identifier="message">
                ${time} <strong> ${answer.data[i].from}</strong> reservadamente para <strong>${answer.data[i].to}</strong>: ${answer.data[i].text}
            </div>`;
        }
    }

    console.log(lastMessage);
    if (!lastMessage.isEqualNode(document.querySelector(".chat .message:last-of-type"))) { document.querySelector(".chat .message:last-of-type").scrollIntoView() }
}

function requestParticipants() {
    axios.get("https://mock-api.driven.com.br/api/v4/uol/participants").then(participants);
}

function participants(answer) {
    document.querySelector(".participants").innerHTML =
        `<div class="participant" onclick="selectParticipant(this)" data-identifier="participant">
            <ion-icon name="people"></ion-icon>
            <span>Todos</span>
            <ion-icon class="check display" name="checkmark-outline"></ion-icon>
        </div>`;

    for (let i = 0; i < answer.data.length; i++) {
        document.querySelector(".participants").innerHTML +=
            `<div class="participant" onclick="selectParticipant(this)">
                <ion-icon name="people"></ion-icon>
                <span>${answer.data[i].name}</span>
                <ion-icon class="check" name="checkmark-outline"></ion-icon>
            </div>`;
    }
}

function selectParticipant(selectedParticipant) {
    document.querySelector(".check.display").classList.remove("display");
    selectedParticipant.querySelector(".check").classList.add("display");

    globalTo = selectedParticipant.querySelector("span").innerText;

    refreshMessageInfo();
}

function selectVisibility(selectedVisiblity) {
    document.querySelector(".visibilities .check.display").classList.remove("display");
    selectedVisiblity.querySelector(".check").classList.add("display");

    if (selectedVisiblity.querySelector("span").innerText == "Reservadamente") globalType = "private_message";
    else globalType = "message";

    refreshMessageInfo();
}

function refreshMessageInfo() {
    let visibility = "";
    let participant = globalTo;
    if (globalType == "private_message") visibility = "Reservadamente";
    else visibility = "Público";

    if (globalTo.length > 12) participant = globalTo.slice(0, 14) + "...";
    document.querySelector(".bottom-bar span").innerText = `Enviando para ${participant} (${visibility})`;
}


function sendMessage() {
    axios.post("https://mock-api.driven.com.br/api/v4/uol/messages",
        {
            from: globalName,
            to: globalTo,
            text: document.querySelector(".bottom-bar input").value,
            type: globalType
        })
        .then(requestMessages)
        .catch(() => {
            alert("Conexão com o servidor interrompida! A página será reiniciada.")
            window.location.reload();
        });

    document.querySelector(".bottom-bar input").value = '';
}

document.querySelector(".bottom-bar input").addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();

        document.querySelector(".bottom-bar ion-icon").click();
    }
})

function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("active");
    document.querySelector(".sidebar-background").classList.toggle("active");
}

function toggleAutoScroll(clickedElement) {
    clickedElement.classList.toggle("on");
    clickedElement.classList.toggle("off");

    if (clickedElement.classList.contains("on")) autoScroll = setInterval(requestMessages, 3000);
    else clearInterval(autoScroll);
}