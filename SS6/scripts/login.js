function getId(id) {
  return document.getElementById(id);
}

function getIdAccount(email) {
  const data = localStorage.getItem("accounts");
  let accounts = JSON.parse(data);
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email === email) {
      return accounts[i].password;
    }
  }
  return -1;
}

const btnLogin = getId("btnLogin");

btnLogin.onclick = function (e) {
  e.preventDefault();
  const lemail = getId("loginEmail").value;
  const lpassword = getId("loginPassword").value;

  const password = getIdAccount(lemail);
  if (password === -1) {
    alert("Tài khoản không tồn tại!");
    return;
  } else if (password !== lpassword) {
    alert("Mật khẩu không chính xác!");
    return;
  } else if (password === lpassword) {
    alert("Đăng nhập thành công!");
    window.location.href = "index.html";
  }
};
