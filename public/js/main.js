const translations = {
  id: "/id/translations.json",
  zh: "/zh/translations.json",
};

let currentLanguage = "id"; // Default language is Indonesian

document.addEventListener("DOMContentLoaded", () => {
  const languageButton = document.getElementById("languageButton");
  const languageDropdown = document.getElementById("languageDropdown");
  const storedLanguage = localStorage.getItem("language");

  if (storedLanguage) {
    currentLanguage = storedLanguage;
    setLanguage(currentLanguage);
  } else {
    setLanguage(currentLanguage);
  }

  languageButton.addEventListener("click", function () {
    languageDropdown.style.display =
      languageDropdown.style.display === "block" ? "none" : "block";
  });

  window.onclick = function (event) {
    if (
      !event.target.matches(".dropdown-button") &&
      !event.target.matches(".dropdown-content *")
    ) {
      languageDropdown.style.display = "none";
    }
  };

  document.querySelectorAll(".dropdown-content a").forEach((button) => {
    button.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      setLanguage(lang);
    });
  });
});

function setLanguage(language) {
  currentLanguage = language;
  localStorage.setItem("language", language);
  loadLanguage(language);
}

function loadLanguage(language) {
  fetch(translations[language])
    .then((response) => response.json())
    .then((data) => {
      document.title = data.indexTitle;
      document.getElementById("header-title").innerHTML = data.headerTitle;
      document.getElementById("register-button").innerText =
        data.registerButton;
      document.getElementById("login-button").innerText = data.loginButton;
      document.getElementById("header-right").innerHTML = data.headerRight;
    })
    .catch((error) => console.error("Error loading translation:", error));
}
