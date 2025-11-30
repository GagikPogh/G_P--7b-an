// Админ-панель для просмотра всех сообщений поддержки

// Функция для получения всех сообщений
function getSupportMessages() {
  const messages = localStorage.getItem("supportMessages");
  return messages ? JSON.parse(messages) : [];
}

// Функция для удаления сообщения
function deleteMessage(id) {
  if (!confirm("Հաստատե՞ք հաղորդագրության ջնջումը:")) {
    return;
  }
  
  const messages = getSupportMessages();
  const filtered = messages.filter(m => m.id !== id);
  localStorage.setItem("supportMessages", JSON.stringify(filtered));
  loadMessages();
  updateStats();
}

// Функция для форматирования даты
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("hy-AM", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Функция для обновления статистики
function updateStats() {
  const messages = getSupportMessages();
  const total = messages.length;
  
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const weekMessages = messages.filter(m => new Date(m.date) >= weekAgo).length;
  const monthMessages = messages.filter(m => new Date(m.date) >= monthAgo).length;
  
  document.getElementById("totalMessages").textContent = total;
  document.getElementById("weekMessages").textContent = weekMessages;
  document.getElementById("monthMessages").textContent = monthMessages;
}

// Функция для загрузки и отображения сообщений
function loadMessages(searchTerm = "") {
  const messages = getSupportMessages();
  const messagesList = document.getElementById("messagesList");
  
  // Сортируем по дате (новые сначала)
  const sortedMessages = [...messages].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  // Фильтруем по поисковому запросу
  const filteredMessages = searchTerm
    ? sortedMessages.filter(m => {
        const search = searchTerm.toLowerCase();
        return (
          m.name.toLowerCase().includes(search) ||
          m.contact.toLowerCase().includes(search) ||
          m.message.toLowerCase().includes(search)
        );
      })
    : sortedMessages;
  
  if (filteredMessages.length === 0) {
    messagesList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <h3>Հաղորդագրություններ չկան</h3>
        <p>Դեռ ոչ մի հաղորդագրություն չի ստացվել:</p>
      </div>
    `;
    return;
  }
  
  messagesList.innerHTML = filteredMessages.map(message => `
    <div class="message-card">
      <div class="message-header">
        <div>
          <div class="message-name">${escapeHtml(message.name)}</div>
          <div class="message-contact">📞 ${escapeHtml(message.contact)}</div>
        </div>
        <div style="text-align: right;">
          <div class="message-time">🕐 ${formatDate(message.date)}</div>
          <button class="btn-delete" onclick="deleteMessage('${message.id}')">Ջնջել</button>
        </div>
      </div>
      <div class="message-text">${escapeHtml(message.message)}</div>
      ${message.page ? `<div class="message-page">🌐 ${escapeHtml(message.page)}</div>` : ""}
    </div>
  `).join("");
}

// Функция для экранирования HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Поиск
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    loadMessages(e.target.value);
  });
}

// Инициализация
updateStats();
loadMessages();

