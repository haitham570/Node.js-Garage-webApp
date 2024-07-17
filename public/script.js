'use strict';


const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector("[data-nav-toggler]");

navToggler.addEventListener("click", function(){
    navbar.classList.toggle("active");
    this.classList.toggle("active");
});

const loginButton = document.getElementById("loginButton");

if (loginButton) {
    loginButton.addEventListener("click", function(event){
        event.preventDefault();
        window.location.href = "login.html";
    });
}

const registerButton = document.getElementById("registerButton");

if (registerButton) {
    registerButton.addEventListener("click", function(event){
        event.preventDefault();
        window.location.href = "register.html";
    });
}

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        window.location.href = 'index.html';  
    });
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event){
        event.preventDefault();
        window.location.href = "login.html";
    });
}

const homeButton = document.getElementById("homeButton");

if (homeButton) {
    homeButton.addEventListener("click", function(event){
        event.preventDefault();
        window.location.href = "index.html";
    });
}

const appointmentButton = document.getElementById("appointmentButton");

if(appointmentButton) {
    appointmentButton.addEventListener("click", function(event){
        event.preventDefault();
        window.location.href = "appointment.html";
        
    });
}

const servicesButton = document.getElementById("servicesButton");

if (servicesButton) {
    servicesButton.addEventListener("click", function(event){
        event.preventDefault();
        window.location.href = "services.html";
        
    });
}


/* user experience functionalities */

function editProfile(id) {
    const element = document.getElementById(id);
    const currentValue = element.textContent;
    element.innerHTML = `<input type="text" id="${id}-input" value="${currentValue}" />
                        <button onclick="saveProfile('${id}')">Save</button>`;

}

function saveProfile(id) {
    const inputElement = document.getElementById(`${id}-input`);
    const newValue = inputElement.value;
    document.getElementById(id).textContent = newValue;
}

function showVisitDetails() {
    const visitDetails = {
        "2023-01-15": {
            service: "Oil Change",
            comments: "Very satisfied with the service.",
            receipt: "receipts/2023-03-10-receipt.pdf"
        }
    };

    const selectedDate = document.getElementById("visitDates").value;
    const visitDetailContainer = document.getElementById("visitDetails");

    if (selectedDate && visitDetails[selectedDate]) {
        const details = visitDetails[selectedDate];

        visitDetailContainer.innerHTML = `<p>Date: ${selectedDate}</p>
                                            <p>Service: ${details.service}</p>
                                            <p>Comments: ${details.comments}</p>
                                            <a href="${details.receipt}" download>Download Receipt</a>
                                            <br><br>
                                            <label for="feedback">Leave a Comment:</label>
                                            <textarea id="feedback" rows="4" placeholder="Write your feedback here..."></textarea>
                                            <br>
                                            <button onclick="submitFeedback('${selectedDate}')">Submit Feedback</button>`;

    
    }else {
        visitDetailContainer.innerHTML = ""
    }
}

function submitFeedback(date) {
    const feedback = document.getElementById("feedback").value;
    if (feedback) {
        alert(`Feedback for ${date}: ${feedback}`);
        
    } else {
        alert("Please enter your feedback.");
    }
}