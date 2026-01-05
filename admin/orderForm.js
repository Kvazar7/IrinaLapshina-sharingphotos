const form = document.getElementById("orderForm");
const ordersList = document.getElementById("ordersList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const orderData = {
    clientNames: formData.get("clientNames").trim(),
    phone: formData.get("phone").trim(),
    sessionType:
      formData.get("sessionType") === "custom"
        ? formData.get("customSessionType").trim()
        : formData.get("sessionType"),

    orderType:
      formData.get("orderType") === "gift" ? "certificate" : "personal",

    sessionDate: formData.get("sessionDate") || null,
    photoCount: formData.get("photoCount") || null,
    publishPermission: formData.get("publishPermission") || null,
    comments: formData.get("comments")?.trim() || "",
  };

  // 🟡 1. ВАЛІДАЦІЯ ОБОВ'ЯЗКОВИХ ПОЛІВ
  if (
    !orderData.clientNames ||
    !orderData.phone ||
    !orderData.sessionType ||
    !orderData.orderType
  ) {
    alert("❌ Заповніть усі обов'язкові поля!");
    return;
  }

  // 🟡 2. ВАЛІДАЦІЯ ТЕЛЕФОНУ
  const phoneRegex = /^\+380\d{9}$/;
  if (!phoneRegex.test(orderData.phone)) {
    alert("❌ Номер має бути у форматі +380XXXXXXXXX");
    return;
  }
  // 🟡 3. ВІДПРАВКА НА БЕКЕНД
  try {
    const response = await fetch("http://localhost:5000/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const savedOrder = await response.json();

    if (!response.ok) {
      throw new Error(savedOrder.error || "Помилка збереження");
    }

    // 🟡 4. СТВОРЕННЯ КАРТКИ
    createOrderCard(orderData);
    alert("✅ Замовлення успішно створене!");
    form.reset();
  } catch (err) {
    console.error("❌ Помилка відправки:", err.message);
    alert("❌ Не вдалося відправити замовлення");
  }
});

// 🟢 Створення картки
function createOrderCard(order) {
  const card = document.createElement("div");
  card.classList.add("order-card");

  card.innerHTML = `
    <h3>${order.clientNames}</h3>
    <p><b>Телефон:</b> ${order.phone}</p>
    <p><b>Сесія:</b> ${order.sessionType}</p>
    <p><b>Тип:</b> ${order.orderType}</p>

    ${order.sessionDate ? `<p><b>Дата:</b> ${order.sessionDate}</p>` : ""}
    ${order.photoCount ? `<p><b>Кількість фото:</b> ${order.photoCount}</p>` : ""}
    ${order.publishPermission ? `<p><b>Публікація:</b> ${order.publishPermission}</p>` : ""}
    ${order.comments ? `<p><b>Коментар:</b> ${order.comments}</p>` : ""}
    
    <hr>
  `;

  ordersList.prepend(card);
}
