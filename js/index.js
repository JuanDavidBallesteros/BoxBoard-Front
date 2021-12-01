const addCardBtn = document.getElementById("addCardBtn");
const toDoCol = document.getElementById("toDoCol");
const doingCol = document.getElementById("doingCol");
const doneCol = document.getElementById("doneCol");

const recipientTitle = document.getElementById("recipient-title");
const descriptionText = document.getElementById("description-text");


let cards = [
    {
        id: "423413fdg",
        title: "Test1",
        description: "this is a test card",
        date: "may 8",
        status: "doing"

    }, 
    {
        id: "3242",
        title: "Test2",
        description: "this is a test card",
        date: "may 8",
        status: "todo"

    },
    {
        id: "3243432dfb",
        title: "Test3",
        description: "this is a test card",
        date: "may 8",
        status: "done"

    }
]

const load = async () => {

    let response = await fetch("https://box-board.herokuapp.com/api/cards");
    if(response.ok){
        let data = await response.json();

    toDoCol.innerHTML = "";
    doingCol.innerHTML = "";
    doneCol.innerHTML = "";

    data.forEach(card => {
        let cardView = new CardView(card);
        if(card.status == "todo"){
            cardView.render(toDoCol);
        } else if (card.status == "doing"){
            cardView.render(doingCol);
        } else if (card.status == "done"){
            cardView.render(doneCol);
        }
        
    });
    }
    
}

load()

addCard = () => {
    let card = {
        id: uuidv4(),
        title: recipientTitle.value,
        description: descriptionText.value,
        date: "may 6",
        status: "todo"
    }

    cards.push(card)
    load();
}

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  addCardBtn.addEventListener('click', addCard)