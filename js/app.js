// global variables
let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US`
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");


function displayModal(index) {
    // console.log(employees[index]);
    // use object destructuring make our template literal cleaner
    let { 
        name, 
        dob, 
        phone, 
        email, 
        location: { 
            city, 
            street, 
            state, 
            postcode
        }, 
        picture 
    } = employees[index];
    let date = new Date(dob.date);

    const modalHTML = `
        <img class="avatar" src="${picture.large}" />
        <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
            <hr/>
            <p>${phone}</p>
            <p class="address">${street}, ${state} ${postcode}</p>
            <p>Birthday:
            ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
        `;

    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;
}

modalClose.addEventListener('click', () => {
    overlay.classList.add("hidden");
});


async function displayEmployees() {
    let response = null;

    try {
        response = await fetch(urlAPI);
        const data = await response.json();
        employees = data.results;   
    }
    catch (err) {
        console.log(err);
    }    

    // store the employee HTML as its created
    let employeeHTML = '';

    // loop through each employee to create HTML markup
    employees.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;

        // template template literal to display each card
        employeeHTML += `
            <div class="card" data-index="${index}">
                <img class="avatar" src="${picture.large}" />
                <div class="text-container">
                    <h2 class="name">${name.first} ${name.last}</h2>
                    <p class="email">${email}</p>
                    <p class="address">${city}</p>
                </div>
            </div>
            `
    });

    gridContainer.innerHTML = employeeHTML;

    const cards = Array.from(gridContainer.getElementsByClassName('card'));
    cards.forEach((card) => {
        const index = card.getAttribute('data-index');        

        card.addEventListener('click', (e) => {       
            displayModal(index);
        });
    });
}

displayEmployees();
