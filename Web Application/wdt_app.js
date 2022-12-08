//create a staffUserGet function that makes the API call(s) and processes the response(s)

function staffUserGet() {
    $.ajax({
    url: 'https://randomuser.me/api/',
    dataType: 'json',
    success: function(data) {
      console.log(data);
    },
    error: function() {
        console.log("Something went wrong!");
    }
  })
}

// create staffOut function 





// create Employee object with name, surname

class Employee {
    constructor(name, surname) {
        this.name = name;
        this.surname = surname;
    }
}

// create staff member object with picture, email, status, out time, duration, expected return time and inheritance from Employee

class StaffMember extends Employee {
    constructor(name, surname, picture, email, status, outTime, duration, expectedReturnTime) {
        super(name, surname);
        this.picture = picture;
        this.email = email;
        this.status = status;
        this.outTime = outTime;
        this.duration = duration;
        this.expectedReturnTime = expectedReturnTime;
    }
}

// create delivery driver object with vehicle, telephone, deliver address, return time and inheritance from Employee

class DeliveryDriver extends Employee {
    constructor(name, surname, vehicle, telephone, deliverAddress, returnTime) {
        super(name, surname);
        this.vehicle = vehicle;
        this.telephone = telephone;
        this.deliverAddress = deliverAddress;
        this.returnTime = returnTime;
    }
}