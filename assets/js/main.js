// Mobile navigation toggle
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();

// Footer year
document.querySelectorAll("[data-year]").forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Demo booking form — nothing is sent anywhere
(function () {
  const form = document.querySelector("#booking-form");
  if (!form) return;

  const from = form.querySelector("#from-date");
  const to = form.querySelector("#to-date");
  const petError = form.querySelector("#pet-error");
  const dateError = form.querySelector("#date-error");
  const petBoxes = Array.from(form.querySelectorAll('input[name="pet_type"]'));

  // Don't allow dates in the past, and keep "To" on or after "From"
  const today = new Date();
  const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  from.min = iso;
  to.min = iso;
  from.addEventListener("change", function () {
    to.min = from.value || iso;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const petChosen = petBoxes.some(function (box) {
      return box.checked;
    });
    petError.classList.toggle("is-visible", !petChosen);

    const datesOk = !from.value || !to.value || to.value >= from.value;
    dateError.classList.toggle("is-visible", !datesOk);

    if (!form.checkValidity() || !petChosen || !datesOk) {
      form.reportValidity();
      return;
    }

    const note = document.querySelector(".form-success");
    note.classList.add("is-visible");
    form.reset();
    to.min = iso;
    note.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();

// Locations map: Portsmouth home base with a 25-mile service radius
(function () {
  const el = document.querySelector("#coverage-map");
  if (!el || !window.L) return;

  const portsmouth = [43.0718, -70.7626];
  const radiusMeters = 25 * 1609.344;

  const map = L.map(el, { scrollWheelZoom: false }).setView(portsmouth, 9);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const area = L.circle(portsmouth, {
    radius: radiusMeters,
    color: "#2f5d50",
    weight: 2,
    dashArray: "6 6",
    fillColor: "#2f5d50",
    fillOpacity: 0.12
  }).addTo(map);

  L.circleMarker(portsmouth, {
    radius: 9,
    color: "#ffffff",
    weight: 3,
    fillColor: "#d8664a",
    fillOpacity: 1
  })
    .addTo(map)
    .bindPopup("<strong>Portsmouth, NH</strong><br>Sandra's home base for boarding &amp; day care");

  map.fitBounds(area.getBounds(), { padding: [16, 16] });
})();
