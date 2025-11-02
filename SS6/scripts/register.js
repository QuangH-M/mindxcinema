function getId(id) {
  return document.getElementById(id);
}

btnRegister.onclick = function (e) {
  e.preventDefault();
  const rusername = getId("registerUsername").value;
  const remail = getId("registerEmail").value;
  const rpassword = getId("registerPassword").value;
  const rconfirmpassword = getId("registerConfirmPassword").value;

  if (rpassword === rconfirmpassword) {
    const account = {
      username: rusername,
      email: remail,
      password: rpassword,
    };

    const data = localStorage.getItem("accounts");
    let accounts = JSON.parse(data);
    if (accounts === null) {
      accounts = [];
    }
    accounts.push(account);
    localStorage.setItem("accounts", JSON.stringify(accounts));
    window.location.href = "login.html";
  } else {
    alert("Mật khẩu không trùng nhau!");
    return;
  }
}
