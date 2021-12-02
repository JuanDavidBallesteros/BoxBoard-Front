class CardView {

    //State
    constructor(card, alert, reload) {
        this.card = card;
        this.alert = alert;
        this.load = reload;
        Object.seal(this);
    }


    //Metodos
    render = (container) => {
        let div = document.createElement("div");
        div.classList.add("card");

        let html = `
                <div class="card-body">
                          <h5 class="card-title">${this.card.title}</h5>
                          <p class="card-text">${this.card.description}</p>
                          <p class="card-date">${this.card.date}</p>
            
        `

        if (this.card.status === "todo") {
            html += `
            <div class="buttons-card">
                              <button type="button" class="btn delete btn-sm" id="delete${this.card.id}">Delete</button>
                              <button type="button" class="btn goNext btn-sm" id="next${this.card.id}">Next</button>
                          </div>
                        </div>
            `
        } else if (this.card.status === "doing") {
            html += `
            <div class="buttons-card">
                              <button type="button" class="btn goBack btn-sm" id="back${this.card.id}">Back</button>
                              <button type="button" class="btn delete btn-sm" id="delete${this.card.id}">Delete</button>
                              <button type="button" class="btn goNext btn-sm" id="next${this.card.id}">Next</button>
                          </div>
                        </div>
            `
        } else if (this.card.status === "done") {
            html += `
            <div class="buttons-card">
                              <button type="button" class="btn goBack btn-sm" id="back${this.card.id}">Back</button>
                              <button type="button" class="btn delete btn-sm" id="delete${this.card.id}">Delete</button>
                          </div>
                        </div>
            `
        } else {
            html += "</div>"
        }

        div.innerHTML = html;
        container.appendChild(div);

        if (this.card.status === "todo") {
            let btnDelete = document.getElementById("delete" + this.card.id);
            this.deleteAction(btnDelete);

            let btnNext = document.getElementById("next" + this.card.id);
            this.nextAction(btnNext);

        } else if (this.card.status === "doing") {

            let btnDelete = document.getElementById("delete" + this.card.id)
            this.deleteAction(btnDelete);

            let btnBack = document.getElementById("back" + this.card.id)
            this.backAction(btnBack);

            let btnNext = document.getElementById("next" + this.card.id)
            this.nextAction(btnNext);

        } else if (this.card.status === "done") {

            let btnBack = document.getElementById("back" + this.card.id)
            this.backAction(btnBack);

            let btnDelete = document.getElementById("delete" + this.card.id)
            this.deleteAction(btnDelete);

        } else {
            html += "</div>"
        }
    }

    deleteAction = (btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            let response = await fetch("https://box-board.herokuapp.com/api/cards/"+this.card.id, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (response.ok) {
                alert('tarjeta eliminada', 'success')
                reload()
            } else {
                alert('No se pudo completar la acción', 'danger')
            }
        });
    }

    nextAction = (btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            let temp = { ...this.card }

            if (this.card.status === "todo") {
                temp.status = "doing";
            } else if (this.card.status === "doing") {
                temp.status = "done";
            }

            let response = await fetch("https://box-board.herokuapp.com/api/cards/", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(temp)
            })
            if (response.ok) {
                alert('tarjeta movida', 'success')
                reload()
            } else {
                alert('No se pudo completar la acción', 'danger')
            }
        })
    }

    backAction = (btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            let temp = { ...this.card }

            if (this.card.status === "done") {
                temp.status = "doing";
            } else if (this.card.status === "doing") {
                temp.status = "todo";
            }

            let response = await fetch("https://box-board.herokuapp.com/api/cards/", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(temp)
            })
            if (response.ok) {
                alert('tarjeta movida', 'success')
                reload()
            } else {
                alert('No se pudo completar la acción', 'danger')
            }
        })
    }

}