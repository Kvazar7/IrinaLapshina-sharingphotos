const toggleBtn = document.getElementById('toggleListBtn');
const sessionsContainer = document.getElementById('sessionsContainer');
const select = document.getElementById('sessionTypeSelect');
const customInput = document.getElementById('customSessionType');

let isVisible = true;

const statusLabels = {
  draft: "Попередні",
  waiting: "Чекаємо зйомку",
  raw_ready: "Готуємо фото на відбір",
  editing: "Обробка",
  edited: "Оброблено",
  completed: "Завершено"
};

document.addEventListener("DOMContentLoaded", loadOrders);

async function loadOrders() {
  try {
    const res = await fetch("http://localhost:5000/api/orders");
    const orders = await res.json();
    renderOrdersTable(orders);
  } catch (err) {
    console.error("❌ Не вдалося завантажити замовлення", err);
  }
}

function renderOrdersTable(orders) {
  const tbody = document.getElementById("sessionsTableBody");
  tbody.innerHTML = "";

  orders.forEach(order => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${order.clientNames}</td>
      <td>${order.sessionDate ? formatDate(order.sessionDate) : "—"}</td>
      <td>${order.sessionType}</td>
      <td>
        <span class="status ${order.status}">
          ${statusLabels[order.status]}
        </span>
      </td>
    `;

    tbody.appendChild(tr);

    tr.dataset.id = order._id;

    tr.addEventListener("click", () => {
      openSessionEditor(order);
    });
  });
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("uk-UA");
}

toggleBtn.addEventListener('click', () => {
  sessionsContainer.style.maxHeight = isVisible ? '0' : '600px';
  toggleBtn.textContent = isVisible ? 'Показати фотосесії' : 'Приховати фотосесії';
  isVisible = !isVisible;
});

document.getElementById('scrollToCreateBtn').addEventListener('click', () => {
  document.getElementById('createSessionSection')
    .scrollIntoView({ behavior: 'smooth' });
});

select.addEventListener('change', () => {
  customInput.style.display = select.value === "custom" ? "block" : "none";
});

// 🟢 Обробка форми створення замовлення
let currentOrderId = null;

function openSessionEditor(order) {
  currentOrderId = order._id;

  const editor = document.getElementById("sessionEditor");
  editor.classList.remove("hidden");

  const form = document.getElementById("editorForm");

  form.clientNames.value = order.clientNames;
  form.sessionDate.value = order.sessionDate?.split("T")[0] || "";
  form.sessionType.value = order.sessionType;
  form.status.value = order.status;
  form.phone.value = order.phone;
  form.orderType.value = order.orderType;
  form.photoCount.value = order.photoCount || "";
  form.allowPublish.value = order.allowPublish ? "true" : "false";
  form.comment.value = order.comment || "";

  setReadOnlyMode();
}

// 🟢 Обробка форми редагування замовлення
function setReadOnlyMode() {
  document
    .querySelectorAll("#editorForm input, #editorForm select, #editorForm textarea")
    .forEach(el => el.disabled = true);

  document.getElementById("editBtn").disabled = false;
  document.getElementById("saveBtn").disabled = true;
}

document.getElementById("editBtn").addEventListener("click", () => {
  document
    .querySelectorAll("#editorForm input, #editorForm select, #editorForm textarea")
    .forEach(el => el.disabled = false);

  document.getElementById("editBtn").disabled = true;
  document.getElementById("saveBtn").disabled = false;
});

