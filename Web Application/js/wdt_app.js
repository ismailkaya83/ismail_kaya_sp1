window.onload = function () {
    staffUserGet();
};

// CLASSES
class Employee {
    constructor(name, surname) {
        this.name = name;
        this.surname = surname;
    }
};

class StaffMember extends Employee {
    constructor(name, surname, email, picture, status, outTime, duration, expectedReturnTime, staffMemberIsLate) {
        super(name, surname);
        this.email = email;
        this.picture = picture;
        this.status = status;
        this.outTime = outTime;
        this.duration = duration;
        this.expectedReturnTime = expectedReturnTime;
        this.staffMemberIsLate = staffMemberIsLate;
    }
};

class DeliveryDriver extends Employee {
    constructor(name, surname, vehicle, telephone, address, returnTime, deliveryDriverIsLate) {
        super(name, surname);
        this.vehicle = vehicle;
        this.telephone = telephone;
        this.address = address;
        this.returnTime = returnTime;
        this.deliveryDriverIsLate = deliveryDriverIsLate;
    }
}

let currentTime = new Date();
let currentHours = currentTime.getHours() < 10 ? "0" + currentTime.getHours() : currentTime.getHours();
let currentMinutes = currentTime.getMinutes() < 10 ? "0" + currentTime.getMinutes() : currentTime.getMinutes();
let staffMembers = [];
let deliveryDrivers = [];

// FUNCTIONS
function staffUserGet() {
    $.ajax({
        url: 'https://randomuser.me/api/?results=5',
        dataType: 'json',
        success: function (data) {
            data.results.forEach(function (result) {
                let staffMember = new StaffMember(
                    result.name.first,
                    result.name.last,
                    result.email,
                    result.picture.thumbnail,
                    "IN",
                    "",
                    "",
                    "",
                    false
                );
                staffMembers.push(staffMember);
            });

            staffMembers.forEach(function (staffMember) {
                $("#staffTable tbody").append(
                    `<tr id=${staffMember.name}>
                        <td><img src=${staffMember.picture} alt="avatar"></td>
                        <td>${staffMember.name}</td>
                        <td>${staffMember.surname}</td>
                        <td class="email">${staffMember.email}</td>
                        <td class="status">${staffMember.status}</td>
                        <td class="out-time"></td>
                        <td class="duration"></td>
                        <td class="return-time"></td>
                    </tr>`
                );
            });
        }
    });
    return staffMembers;
};

function staffOut() {
    staffMembers.forEach(function (staffMember) {
            if ($(`#${staffMember.name}`).hasClass("select")) {
                // calculate the out time
                let outTime = `${currentHours}:${currentMinutes}`;
                staffMember.outTime = outTime;
                $(`#${staffMember.name}`).find(".out-time").text(outTime);

                // calculate the duration
                let duration = prompt("Please enter the duration of the staff member's absence in minutes");
                staffMember.duration = duration;
                $(`#${staffMember.name}`).find("td:nth-child(7)").text(duration);

                // calculate the expected return time
                let expectedReturnTimeHours = parseInt(currentHours) + Math.floor(parseInt(duration) / 60);
                if (expectedReturnTimeHours < 10) {
                    expectedReturnTimeHours = "0" + expectedReturnTimeHours;
                }
                let expectedReturnTimeMinutes = parseInt(currentMinutes) + parseInt(duration) % 60;
                if (expectedReturnTimeMinutes < 10) {
                    expectedReturnTimeMinutes = "0" + expectedReturnTimeMinutes;
                }
                let expectedReturnTime = `${expectedReturnTimeHours}:${expectedReturnTimeMinutes}`;
                staffMember.expectedReturnTime = expectedReturnTime;
                $(`#${staffMember.name}`).find("td:nth-child(8)").text(expectedReturnTime);
            }
        }
    );
};

function staffIn() {
    staffMembers.forEach(function (staffMember) {
        if ($(`#${staffMember.name}`).hasClass("select")) {
            staffMember.status = "IN";
            $(`#${staffMember.name}`).find(".status").text(staffMember.status);

            // clear the out time
            staffMember.outTime = "";
            $(`#${staffMember.name}`).find(".out-time").text(staffMember.outTime);

            // clear the duration
            staffMember.duration = "";
            $(`#${staffMember.name}`).find(".duration").text(staffMember.duration);

            // clear the expected return time
            staffMember.expectedReturnTime = "";
            $(`#${staffMember.name}`).find(".return-time").text(staffMember.expectedReturnTime);
        }
    });
};

function staffMemberIsLate() {
    staffMembers.forEach(function (staffMember) {
            if (staffMember.expectedReturnTime !== "" && staffMember.staffMemberIsLate === false) {
                console.log(staffMember.name);
                let expectedReturnTimeHours = parseInt(staffMember.expectedReturnTime.split(":")[0]);
                let expectedReturnTimeMinutes = parseInt(staffMember.expectedReturnTime.split(":")[1]);
                if (expectedReturnTimeHours < parseInt(currentHours) || (expectedReturnTimeHours === parseInt(currentHours) && expectedReturnTimeMinutes < parseInt(currentMinutes))) {
                    let outTimeHours = parseInt(currentMinutes) - expectedReturnTimeMinutes
                    showToastForStaff(staffMember.name, staffMember.surname, staffMember.picture, outTimeHours);
                    staffMember.staffMemberIsLate = true;
                }
            }
        }
    );
};
setInterval(staffMemberIsLate, 10000);

function deliveryDriverIsLate() {
    deliveryDrivers.forEach(function (deliveryDriver) {
            if (deliveryDriver.returnTime !== "" && deliveryDriver.deliveryDriverIsLate === false) {
                console.log(deliveryDriver.name);
                let returnTimeHours = parseInt(deliveryDriver.returnTime.split(":")[0]);
                let returnTimeMinutes = parseInt(deliveryDriver.returnTime.split(":")[1]);
                if (returnTimeHours < parseInt(currentHours) || (returnTimeHours === parseInt(currentHours) && returnTimeMinutes < parseInt(currentMinutes))) {
                    showToastForDelivery(deliveryDriver.name, deliveryDriver.surname, deliveryDriver.telephone, deliveryDriver.address, deliveryDriver.returnTime);
                    deliveryDriver.deliveryDriverIsLate = true;
                }
            }
        }
    );
}

setInterval(deliveryDriverIsLate, 10000);

function validateDelivery(name, surname, telephone, returnTime) {

    if (!name || name.length < 2 || /\d/.test(name)) {
        alert("Please enter a valid name");
        return false;
    }
    if (!surname || surname.length < 2 || /\d/.test(surname)) {
        alert("Please enter a valid surname");
        return false;
    }
    if (!telephone || !/^\d{2}$/.test(telephone)) {
        alert("Please enter a valid telephone number");
        return false;
    }
    if (!returnTime || !/^\d{2}:\d{2}$/.test(returnTime) || parseInt(returnTime.substring(0, 2)) > 23 || parseInt(returnTime.substring(3, 5)) > 59) {
        alert("Please enter a valid return time");
        return false;
    }
    return true;
};

function addDelivery() {
    let vehicle = $("#vehicle_2").val();
    let name = $("#name_2").val();
    let surname = $("#surname_2").val();
    let telephone = $("#telephone_2").val();
    let address = $("#address_2").val();
    let returnTime = $("#returnTime_2").val();
    let deliveryDriverIsLate = false;

    if (validateDelivery(name, surname, telephone, returnTime)) {
        let deliveryDriver = new DeliveryDriver(name, surname, vehicle, telephone, address, returnTime, deliveryDriverIsLate);
        deliveryDrivers.push(deliveryDriver);

        // scheduleDeliveryTable input text clear
        $("#scheduleDeliveryTable")
            .find("input[type=text], textarea")
            .val("");

        // assign icon to the delivery driver
        let icon = "";
        if (vehicle === "Motorcycle") {
            icon = "<i class='fas fa-motorcycle'></i>";
        } else {
            icon = "<i class='fas fa-bicycle'></i>";
        }

        $("#deliveryBoardTable tbody").append(
            `<tr id=${deliveryDriver.name}>
                <td>${icon}</td>
                <td>${deliveryDriver.name}</td>
                <td>${deliveryDriver.surname}</td>
                <td>${deliveryDriver.telephone}</td>
                <td>${deliveryDriver.address}</td>
                <td>${deliveryDriver.returnTime}</td>
             </tr>`);
    }
};


function removeDeliveryDriver() {
    deliveryDrivers = deliveryDrivers.filter(deliveryDriver => {
        if ($(`#${deliveryDriver.name}`).hasClass("select")) {
            // Confirm with the user that they want to remove the delivery driver
            const confirmation = window.confirm(`Are you sure you want to remove ${deliveryDriver.name}?`);
            if (confirmation) {
                // Get the element with an id equal to the delivery driver's name
                const element = document.getElementById(deliveryDriver.name);

                // Get the parent element of the element (assuming it is a child of the parent)
                const parent = element.parentNode;

                // Remove the element from the parent
                parent.removeChild(element);

                return false;  // exclude this delivery driver from the new array
            }
        }
        return true;  // include this delivery driver in the new array
    });
}


$(document).ready(function () {
    // When the user select any row, the out button should be clickable
    $("#staffTable").delegate("tbody tr", "click", function () {
        $(this).addClass("select").siblings().removeClass("select");
        $("#out").removeClass("disabled");
    });

    // when the user click on the out button, the in button should be clickable
    $("#out").click(function () {
        $("#in").removeClass("disabled");
    });

    // When the user select any row, the clear button should be clickable
    $(`#deliveryBoardTable`).delegate("tbody tr", "click", function () {
        $(this).addClass("select").siblings().removeClass("select");
        $("#clear").removeClass("disabled");
    });

    // the current date and time should be displayed on the page, format should be dd/mm/yyyy hh:mm:seconds, and it should be updated every second
    setInterval(function () {
        currentTime = new Date();
        currentHours = currentTime.getHours() < 10 ? "0" + currentTime.getHours() : currentTime.getHours();
        currentMinutes = currentTime.getMinutes() < 10 ? "0" + currentTime.getMinutes() : currentTime.getMinutes();
        let currentSeconds = currentTime.getSeconds() < 10 ? "0" + currentTime.getSeconds() : currentTime.getSeconds();
        $("#currentDateTime").text(`${currentTime.getDate()}/${currentTime.getMonth() + 1}/${currentTime.getFullYear()} ${currentHours}:${currentMinutes}:${currentSeconds}`);
    });
});

// create a function to show the toast message
function showToastForStaff(name, surname, picture, outOfTime) {
    $(document).ready(function () {
        $(".toast-container").append(
            `<div class="toast"
                    data-bs-autohide="false"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true">
                    <div class="toast-header">
                        <strong class="me-auto">Staff Is Late</strong>
                        <small>Now</small>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                    <img src="${picture}" alt="avatar">
                        ${name} ${surname} is ${outOfTime} minutes late.
                    </div>
                </div>`
        );
        $(".toast").toast("show");
    });
}

function showToastForDelivery(name, surname, telephone, address, returnTime) {
    $(document).ready(function () {
        $(".toast-container").append(
            `<div class="toast"
                    data-bs-autohide="false"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true">
                    <div class="toast-header">
                        <strong class="me-auto">Delivery Is Late</strong>
                        <small>Now</small>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        ${name} ${surname} is late for delivery. Please contact ${telephone} to arrange delivery to ${address} by ${returnTime}.
                    </div>
                </div>`
        );
        $(".toast").toast("show");
    });
}