function signup() {
  let user = document.getElementById("newUser").value;
  let pass = document.getElementById("newPass").value;

  if (user === "" || pass === "") {
    alert("Please fill all fields");
    return;
  }

  localStorage.setItem(user, pass);
  alert("Signup successful!");
}

function login() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  let storedPass = localStorage.getItem(user);

  if (storedPass === pass) {
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    alert("Invalid credentials");
  }
}