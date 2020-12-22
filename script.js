// const showRulesButton = document.getElementById('toggleID');






const toggle = document.getElementById('toggle');
document.body.classList.toggle('show-nav');
document.body.classList.toggle('change');

toggle.addEventListener('click', ()=> {
    document.body.classList.toggle('show-nav');
    document.body.classList.toggle('change');
}
);


// const toggleV = document.getElementById('toggleV');
// toggleV.addEventListener('click', ()=> {
//     document.body.classList.toggle('show-nav');
//     document.body.classList.toggle('change');
// }
// );
let submitForm = document.getElementById("submit");

function sendEmail(){
    console.log("sending email");
    Email.send({
        SecureToken : "9ee880b5-52ac-491e-9311-604a5000b59e",
        To : email,
        From : "timilsinasandesh7@mail.com",
        Subject : "Message sent to sandesh",
        Body : "<html><h2>Thank You for reaching out.</h2><strong>Your subject : </strong>"+subject+
         " <br></br><strong>Your message : </strong><br></br>"+message+ "<br></br> Thank you for "+
        "visitng www.sandesht.com</html>"
        }).then(function(response){
            if(response == 'OK'){
                alert("Form Submitted Successfully!");
            }else {
                throw new Error("Error : "+ response.statusText);
            }
        } 
             
        );
}

let name;
let subject;
let phone;
let email;
let message;
let error_message;

  
submitForm.addEventListener("click", e=>{
    name = document.getElementById("name").value;
    subject = document.getElementById("subject").value;
    phone = document.getElementById("phone").value;
    email = document.getElementById("email").value;
    message = document.getElementById("message").value;
    error_message = document.getElementById("error_message");
    
    error_message.style.padding = "10px";
    
    var text;
    if(name.length < 2){
      text = "Please Enter valid Name";
      error_message.innerHTML = text;
      console.log("error 1");
      return false;
    }
    if(subject.length < 1){
      text = "Please Enter Correct Subject";
      error_message.innerHTML = text;
      console.log("error 1");
      return false;
    }
    if(isNaN(phone) || phone.length < 10){
      text = "Please Enter valid Phone Number";
      error_message.innerHTML = text;
      console.log("error 1");
      return false;
    }
    if(email.indexOf("@") == -1 || email.length < 4){
      text = "Please Enter valid Email";
      error_message.innerHTML = text;
      console.log("error 1");
      return false;
    }
    if(message.length >= 400){
      text = "Please Enter less Than 400 Characters";
      error_message.innerHTML = text;
      console.log("error 1");
      return false;
    }
    
    sendEmail();
  });