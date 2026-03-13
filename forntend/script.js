const API = "http://localhost:3000/api/auth";

function show(data) {
  document.getElementById("response").textContent = JSON.stringify(
    data,
    null,
    2,
  );
}

async function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  const res = await fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json().catch(() => ({}));;

  if (!res.ok) {
    showToast(data.error || "Error ao registrar", "error");
    return;
  }

  showToast(data.message || "Conta criada com sucesso", "success");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}

async function login() {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "dashboard.html";
    return;
  }

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);

    window.location.href = "dashboard.html";
  } else {
    showToast(data.error || "Erro no login!", "error");
    return;
  }
}

async function getProfile() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
  }

  const res = await fetch(API + "/profile", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const data = await res.json();
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.className = "";

  if (type === "error") {
    toast.classList.add("toast-error");
  } else {
    toast.classList.add("toast-success");
  }

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
