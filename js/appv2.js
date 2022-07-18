// global variables
const urlAPI = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US`
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const nameFilterInput = document.querySelector("#name-filter");
let employees = [];
const changeEmployees = document.querySelector(".scroll");
console.log(changeEmployees);

// **** code to display Modal ****

function displayModal(index, employees) {
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
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let year = String(date.getFullYear()).padStart(2, '0');
    let birthday = [day, month, year].join('/');

    const modalHTML = `
        <img class="avatar" src="${picture.large}" />
        <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
            <hr/>
            <p>${phone}</p>
            <p class="address">${street.number}, ${street.name}, ${state}, ${postcode}</p>
            <p>Birthday:
            ${birthday}</p>
        </div>
        `;
        
    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;
    document.body.style.overflow = "hidden";




    changeEmployees.addEventListener('click', (e) => {
 
        let buttonPressed = e.target.classList.value;
        console.log(buttonPressed);

        if(buttonPressed === "rightButton") {
            console.log(`right button pressed ${index}`);
        

        } 
        else {
            console.log('left button pressed')
        }
    })
}









// **** code to close modal ****

modalClose.addEventListener('click', () => {
    overlay.classList.add("hidden");
    document.body.style.overflow = "auto";
});







// **** code to display employee information retrieved ****
function displayEmployees(employees) {    
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
            displayModal(index, employees);
        });
    });
}





// **** code to select employee from text search bar ****
nameFilterInput.addEventListener('keyup', (e) => {    
    let nameFilter = e.target.value;
    let filteredEmployees = [];
    function prepareName(str) {
        return str.toLowerCase().trim();
    }

    if (nameFilter) {
        filteredEmployees = employees.filter((employee) => {
            searchStr = prepareName(nameFilter);
            let employeeName = '';      
            Object.values(employee.name).forEach((name) => {
                employeeName += prepareName(name);
            });
            return employeeName.includes(searchStr);
        });
    }
    else {
        filteredEmployees = employees;
    }

    displayEmployees(filteredEmployees);
});



// **** code to fetch employee data from the API **** 
async function fetchEmployees() {  
    let response = null;

    try {
        response = await fetch(urlAPI);
        const data = await response.json();
        employees = data.results;   
    }
    catch (err) {
        console.log(err);
    }

    displayEmployees(employees);
}

fetchEmployees();
