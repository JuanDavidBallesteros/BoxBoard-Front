const addCardBtn = document.getElementById("addCardBtn");
const toDoCol = document.getElementById("toDoCol");
const doingCol = document.getElementById("doingCol");
const doneCol = document.getElementById("doneCol");

const recipientTitle = document.getElementById("recipient-title");
const descriptionText = document.getElementById("description-text");

var alertPlaceholder = document.getElementById('liveAlertPlaceholder')

let cards = [];

const load = async () => {

    let response = await fetch("https://box-board.herokuapp.com/api/cards");
    if (response.ok) {
        let data = await response.json();

        toDoCol.innerHTML = "";
        doingCol.innerHTML = "";
        doneCol.innerHTML = "";

        cards = data;

        data.forEach(card => {
            let cardView = new CardView(card, alert, reload, onDragStart);
            if (card.status == "todo") {
                cardView.render(toDoCol);
            } else if (card.status == "doing") {
                cardView.render(doingCol);
            } else if (card.status == "done") {
                cardView.render(doneCol);
            }
        });

        alert('Datos Cargados Correctamente', 'success')
    } else {
        alert('Datos no pudieron ser cargados', 'danger')
    }

}

load()

const reload = load;

addCard = async () => {

    if (recipientTitle.value === "" || descriptionText.value === "") {
        alert('Campos vacios, llena todos los campos', 'danger')
    } else {
        let dateObj = new Date(Date.now());
        let date = `${dateObj.getDate()}-${dateObj.getMonth()}-${dateObj.getFullYear()}`

        let card = {
            id: uuidv4(),
            title: recipientTitle.value,
            description: descriptionText.value,
            date,
            status: "todo"
        }

        let response = await fetch("https://box-board.herokuapp.com/api/cards", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(card)
        })

        if (response.ok) {
            recipientTitle.value = "";
            descriptionText.value = "";
            load();

            alert('Tarjeta creada', 'success')
        } else {
            alert('Error al crear tarjeta', 'danger')
        }

    }

}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

addCardBtn.addEventListener('click', addCard)

const alert = (message, type) => {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

    alertPlaceholder.append(wrapper)

    setTimeout(() => {
        alertPlaceholder.removeChild(wrapper)
    }, 2500);
}

const onDragStart = (event) => {

    let parent = event.target;


    while (!parent.classList.contains("draggable")) {
        parent = parent.parentNode;
    }

    event
        .dataTransfer
        .setData('text/plain', parent.id);

    event
        .currentTarget
        .style
        .backgroundColor = "rgba(240, 248, 255, 0.8)";


}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    event.preventDefault();

    const id = event
        .dataTransfer
        .getData('text');

    let card = cards.find(x => x.id === id);

    let parent = event.target;
    while (!parent.classList.contains("cards-container")) {
        parent = parent.parentNode;
    }

    let col = parent.id;
    
    console.log(card)

    if (col === "toDoCol") {
        card.status = "todo"
        update(card)
    } else if (col === "doingCol") {
        card.status = "doing"
        update(card)
    } else if (col === "doneCol") {
        card.status = "done"
        update(card)
    }


    if (event.dataTransfer.items) {
        // Use DataTransferItemList interface to remove the drag data
        event.dataTransfer.items.clear();
    } else {
        // Use DataTransfer interface to remove the drag data
        event.dataTransfer.clearData();
    }

}

const update = async (card) => {
    let response = await fetch("https://box-board.herokuapp.com/api/cards/", {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(card)
    })
    if (response.ok) {
        alert('tarjeta movida', 'success')
        reload()
    } else {
        alert('No se pudo completar la acción', 'danger')
    }
}