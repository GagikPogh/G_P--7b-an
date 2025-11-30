// Система поддержки - сохранение сообщений в localStorage
const ADMIN_KEY = "admin_._admin";

// Открытие модального окна поддержки
const supportBtn = document.getElementById("supportBtn");
const supportModal = document.getElementById("supportModal");
const closeSupport = document.getElementById("closeSupport");
const supportForm = document.getElementById("supportForm");
const supportStatus = document.getElementById("supportStatus");

if (supportBtn) {
  supportBtn.addEventListener("click", () => {
    supportModal.classList.add("active");
  });
}

if (closeSupport) {
  closeSupport.addEventListener("click", () => {
    supportModal.classList.remove("active");
    supportForm.reset();
    supportStatus.textContent = "";
  });
}

if (supportModal) {
  supportModal.addEventListener("click", (e) => {
    if (e.target === supportModal) {
      supportModal.classList.remove("active");
      supportForm.reset();
      supportStatus.textContent = "";
    }
  });
}

// Функция для получения всех сообщений из localStorage
function getSupportMessages() {
  const messages = localStorage.getItem("supportMessages");
  return messages ? JSON.parse(messages) : [];
}

// Функция для сохранения сообщения
function saveSupportMessage(message) {
  const messages = getSupportMessages();
  messages.push({
    ...message,
    id: Date.now().toString(),
  });
  localStorage.setItem("supportMessages", JSON.stringify(messages));
}

// Отправка формы поддержки
if (supportForm) {
  supportForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = document.getElementById("supportName").value.trim();
    const contact = document.getElementById("supportEmail").value.trim();
    const message = document.getElementById("supportMessage").value.trim();
    
    // Проверка на админа
    if (name === ADMIN_KEY) {
      // Редирект на админ-панель
      window.location.href = "admin.html";
      return;
    }
    
    if (!name || !contact || !message) {
      supportStatus.textContent = "Խնդրում ենք լրացնել բոլոր դաշտերը:";
      supportStatus.className = "support-status error";
      return;
    }
    
    const formData = {
      name: name,
      contact: contact,
      message: message,
      timestamp: new Date().toLocaleString("hy-AM"),
      date: new Date().toISOString(),
      page: window.location.href,
    };
    
    supportStatus.textContent = "Ուղարկվում է...";
    supportStatus.className = "support-status sending";
    
    try {
      // Сохраняем сообщение в localStorage
      saveSupportMessage(formData);
      
      supportStatus.textContent = "✅ Ձեր հաղորդագրությունը ուղարկված է:";
      supportStatus.className = "support-status success";
      supportForm.reset();
      
      setTimeout(() => {
        supportModal.classList.remove("active");
        supportStatus.textContent = "";
      }, 2000);
    } catch (error) {
      supportStatus.textContent = "❌ Սխալ: " + error.message;
      supportStatus.className = "support-status error";
      console.error("Support form error:", error);
    }
  });
}
