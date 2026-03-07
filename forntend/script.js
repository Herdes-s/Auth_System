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

  const data = await res.json();

  if (data.message) {
    showToast("Conta criada com sucesso", "sucesso");

    window.location.href = "index.html";
  } else {
    showToast(data.error, "error");
  }

  show(data);
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
  }

  show(data);
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
  show(data);
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

function showToast(message, type) {
  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.className = "";

  if (type === "success") {
    toast.classList.add("toast-success");
  } else {
    toast.classList.add("toast-error");
  }

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
