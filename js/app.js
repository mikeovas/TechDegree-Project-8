// global variables
const urlAPI = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US`
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const nameFilterInput = document.querySelector("#name-filter");
let rightBtn = document.querySelector('.rightButton');
let leftBtn = document.querySelector('.leftButton');
const modalButtons = document.getElementsByClassName('modalButton');
let allEmployees = [];




// **** Get the twelve employees from the API ****
fetchEmployees();

// **** code to fetch employee data from the API **** 
async function fetchEmployees() {  
    let response;
    try {
        response = await fetch(urlAPI);
        const data = await response.json();
        allEmployees = data.results;   
    }
    catch (err) {
        console.log(err);
    }
    displayEmployees(allEmployees);
}

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
        filteredEmployees = allEmployees.filter((employee) => {
            searchStr = prepareName(nameFilter);
            let employeeName = '';      
            Object.values(employee.name).forEach((name) => {
                employeeName += prepareName(name);
            });
            return employeeName.includes(searchStr);
        });
    }
    else {
        filteredEmployees = allEmployees;
    }
    displayEmployees(filteredEmployees);
    
});





// **** code to display Modal ****
function displayModal(index, employees) {
 
    // use object destructuring to make the template literal cleaner
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

    employeeIndex = employees.indexOf(employees[index]);
    let date = new Date(dob.date);
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let year = String(date.getFullYear()).padStart(2, '0');
    let birthday = [day, month, year].join('/');

    const modalHTML = `
        <button class="rightButton modalButton">&#62;</button>
        <button class="leftButton modalButton">&#60;</button>
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
    
    rightBtn = document.querySelector('.rightButton');
    leftBtn = document.querySelector('.leftButton');

    // **** event listeners to scroll through modal cards ****

    rightBtn.addEventListener('click', () =>{
        nextCard(employees);
    });  
    leftBtn.addEventListener('click', () => {
        previousCard(employees);
    });
}

// **** to display next card in modal ****
function nextCard(employees) {
    if (employeeIndex < employees.length-1) {
        leftBtn.classList.remove('hidden');
        displayModal(employeeIndex += 1, employees);
    } else if (employeeIndex === employees.length-1) {
        rightBtn.classList.add('hidden');  
    } else {
        rightBtn.classList.remove('hidden');
    }

  }
  
  // **** to display previous card in modal ****
  function previousCard(employees) {
    if (employeeIndex > 0) {
        rightBtn.classList.remove('hidden');  
        displayModal(employeeIndex -= 1, employees);
    } else if (employeeIndex === 0) {
        leftBtn.classList.add('hidden');  
    } else {
        leftBtn.classList.remove('hidden');
    }
  }

// **** code to close modal ****
modalClose.addEventListener('click', () => {
    overlay.classList.add("hidden");
    document.body.style.overflow = "auto";
});




