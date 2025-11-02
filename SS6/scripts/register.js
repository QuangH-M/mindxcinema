function getId(id) {
  return document.getElementById(id);
}

btnRegister.onclick = function (e) {
  e.preventDefault();
  const rusername = (getId("registerUsername").value || "").toString().trim();
  const remail = (getId("registerEmail").value || "").toString().trim();
  const rpassword = (getId("registerPassword").value || "").toString().trim();
  const rconfirmpassword = (getId("registerConfirmPassword").value || "").toString().trim();

  // Validate required fields
  if (!rusername || !remail || !rpassword || !rconfirmpassword) {
    alert("Vui lòng điền tất cả các trường!");
    return; // don't proceed or redirect
  }

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
