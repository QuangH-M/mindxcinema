function getId(id) {
  return document.getElementById(id);
}

function getIdAccount(email) {
  const data = localStorage.getItem("accounts");
  if (!data) return -1;
  let accounts;
  try {
    accounts = JSON.parse(data) || [];
  } catch (e) {
    return -1;
  }
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
  const lemail = (getId("loginEmail").value || "").toString().trim();
  const lpassword = (getId("loginPassword").value || "").toString().trim();

  // Validate required fields
  if (!lemail || !lpassword) {
    alert("Vui lòng điền email và mật khẩu!");
    return; // don't proceed or redirect
  }

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
