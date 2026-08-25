(function () {
  "use strict";

  /* ============================================================
     Intro loader (traffic-light animation)
     ============================================================ */
  (function initIntroLoader() {
    var loader = document.getElementById("introLoader");
    if (!loader) return;

    function finish() {
      loader.classList.add("hide");
      document.documentElement.classList.remove("intro-active");
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 500);
    }

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      finish();
      return;
    }

    document.documentElement.classList.add("intro-active");

    var lamps = [
      loader.querySelector(".tl-red"),
      loader.querySelector(".tl-orange"),
      loader.querySelector(".tl-green")
    ];
    var stepDelay = 650;
    var timers = [];

    lamps.forEach(function (lamp, i) {
      if (!lamp) return;
      timers.push(setTimeout(function () {
        lamps.forEach(function (l) { if (l) l.classList.remove("active"); });
        lamp.classList.add("active");
      }, i * stepDelay));
    });

    var finishTimer = setTimeout(finish, lamps.length * stepDelay + stepDelay);

    var skipBtn = document.getElementById("introSkip");
    if (skipBtn) {
      skipBtn.addEventListener("click", function () {
        timers.forEach(clearTimeout);
        clearTimeout(finishTimer);
        finish();
      });
    }
  })();

  /* ============================================================
     Footer year
     ============================================================ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     Live visitor counter (illustrative — not a real analytics feed).
     Seeds a plausible value based on the time of day, persists it in
     localStorage for the current day, then ticks it up gradually.
     ============================================================ */
  (function initVisitorCounter() {
    var targets = [document.getElementById("visitorCount"), document.getElementById("visitorCountFloat")];
    targets = targets.filter(Boolean);
    if (!targets.length) return;

    var storage = null;
    try { storage = window.localStorage; } catch (e) { storage = null; }

    var today = new Date();
    var dayKey = "rx_visitors_" + today.toISOString().slice(0, 10);
    var count;

    var stored = storage ? storage.getItem(dayKey) : null;
    if (stored && !isNaN(parseInt(stored, 10))) {
      count = parseInt(stored, 10);
    } else {
      var hourFraction = today.getHours() + today.getMinutes() / 60;
      count = Math.round(310 + hourFraction * 95 + Math.random() * 140);
      if (storage) {
        try { storage.setItem(dayKey, String(count)); } catch (e) { /* ignore */ }
      }
    }

    function render() {
      var formatted = count.toLocaleString("fr-FR");
      targets.forEach(function (el) { el.textContent = formatted; });
    }
    render();

    function tick() {
      count += Math.floor(Math.random() * 3) + 1;
      if (storage) {
        try { storage.setItem(dayKey, String(count)); } catch (e) { /* ignore */ }
      }
      render();
      setTimeout(tick, 4000 + Math.random() * 5000);
    }
    setTimeout(tick, 4000 + Math.random() * 5000);
  })();

  /* ============================================================
     Mobile nav burger
     ============================================================ */
  var burger = document.getElementById("burgerBtn");
  var nav = document.getElementById("mainNav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ============================================================
     Brand / model dataset
     ============================================================ */
  var BRANDS = {
    "Peugeot": ["108", "208", "308", "2008", "3008", "5008", "508", "Partner"],
    "Renault": ["Clio", "Captur", "Mégane", "Scénic", "Kadjar", "Talisman", "Twingo", "Kangoo"],
    "Citroën": ["C1", "C3", "C4", "C5 Aircross", "Berlingo", "C3 Aircross", "DS3"],
    "Volkswagen": ["Polo", "Golf", "Tiguan", "Passat", "T-Roc", "T-Cross", "Touran"],
    "Audi": ["A1", "A3", "A4", "A5", "Q2", "Q3", "Q5", "TT"],
    "BMW": ["Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "X1", "X3", "X5"],
    "Mercedes-Benz": ["Classe A", "Classe B", "Classe C", "Classe E", "GLA", "GLC", "CLA"],
    "Toyota": ["Yaris", "Corolla", "C-HR", "RAV4", "Aygo", "Camry", "Proace"],
    "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Mondeo", "EcoSport"],
    "Opel": ["Corsa", "Astra", "Crossland", "Grandland", "Mokka", "Insignia"],
    "Fiat": ["500", "Panda", "Tipo", "500X", "Punto", "Doblo"],
    "Nissan": ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf", "Note"],
    "Dacia": ["Sandero", "Duster", "Logan", "Spring", "Jogger"],
    "Kia": ["Picanto", "Rio", "Ceed", "Sportage", "Niro", "Stonic"],
    "Hyundai": ["i10", "i20", "i30", "Tucson", "Kona", "Santa Fe"],
    "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"],
    "Skoda": ["Fabia", "Octavia", "Kamiq", "Karoq", "Kodiaq", "Scala"],
    "Volvo": ["V40", "V60", "XC40", "XC60", "XC90", "S60"],
    "Mini": ["Cooper", "Countryman", "Clubman"],
    "Alfa Romeo": ["Giulietta", "Giulia", "Stelvio", "Mito"],
    "Honda": ["Civic", "Jazz", "CR-V", "HR-V"],
    "Mazda": ["Mazda2", "Mazda3", "CX-3", "CX-5"],
    "Suzuki": ["Swift", "Vitara", "S-Cross", "Ignis"],
    "Jeep": ["Renegade", "Compass", "Cherokee"],
    "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
    "DS": ["DS3", "DS4", "DS7"],
    "Land Rover": ["Range Rover Evoque", "Discovery Sport", "Defender"],
    "Porsche": ["Macan", "Cayenne", "911", "Panamera"],
    "Autre": []
  };

  var marqueSelect = document.getElementById("f-marque");
  var modeleInput = document.getElementById("f-modele");
  var modeleList = document.getElementById("modeleList");

  if (marqueSelect) {
    var frag = document.createDocumentFragment();
    var placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Sélectionner une marque";
    frag.appendChild(placeholder);
    Object.keys(BRANDS).sort().forEach(function (brand) {
      if (brand === "Autre") return;
      var opt = document.createElement("option");
      opt.value = brand;
      opt.textContent = brand;
      frag.appendChild(opt);
    });
    var autreOpt = document.createElement("option");
    autreOpt.value = "Autre";
    autreOpt.textContent = "Autre marque";
    frag.appendChild(autreOpt);
    marqueSelect.appendChild(frag);

    marqueSelect.addEventListener("change", function () {
      modeleList.innerHTML = "";
      var models = BRANDS[marqueSelect.value] || [];
      models.forEach(function (m) {
        var opt = document.createElement("option");
        opt.value = m;
        modeleList.appendChild(opt);
      });
    });
  }

  var anneeSelect = document.getElementById("f-annee");
  if (anneeSelect) {
    var currentYear = new Date().getFullYear();
    var yFrag = document.createDocumentFragment();
    var yPlaceholder = document.createElement("option");
    yPlaceholder.value = "";
    yPlaceholder.textContent = "Sélectionner une année";
    yFrag.appendChild(yPlaceholder);
    for (var y = currentYear + 1; y >= 1990; y--) {
      var yOpt = document.createElement("option");
      yOpt.value = String(y);
      yOpt.textContent = String(y);
      yFrag.appendChild(yOpt);
    }
    anneeSelect.appendChild(yFrag);
  }

  /* ============================================================
     km field: live thousands-formatting
     ============================================================ */
  var kmInput = document.getElementById("f-km");
  if (kmInput) {
    kmInput.addEventListener("input", function () {
      var digits = kmInput.value.replace(/\D/g, "").slice(0, 7);
      kmInput.value = digits ? Number(digits).toLocaleString("fr-FR") : "";
    });
  }

  /* ============================================================
     Choice-grid buttons (single select per group)
     ============================================================ */
  var wizardData = {};
  document.querySelectorAll(".choice-grid").forEach(function (grid) {
    var field = grid.getAttribute("data-field");
    grid.querySelectorAll(".choice-btn").forEach(function (btn) {
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", function () {
        grid.querySelectorAll(".choice-btn").forEach(function (b) {
          b.classList.remove("selected");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("selected");
        btn.setAttribute("aria-pressed", "true");
        wizardData[field] = btn.textContent.trim();
        clearStepError();
      });
    });
  });

  /* ============================================================
     Multi-step wizard
     ============================================================ */
  var steps = Array.prototype.slice.call(document.querySelectorAll(".form-step[data-step]"));
  var dataSteps = steps.filter(function (s) { return s.getAttribute("data-step") !== "result"; });
  var resultStep = document.querySelector('.form-step[data-step="result"]');
  var btnNext = document.getElementById("btnNext");
  var btnBack = document.getElementById("btnBack");
  var gaugeCircle = document.getElementById("gaugeCircle");
  var gaugePct = document.getElementById("gaugePct");
  var formError = document.getElementById("formError");
  var total = dataSteps.length;
  var current = 0;

  var CIRC = 2 * Math.PI * 52;
  if (gaugeCircle) gaugeCircle.style.strokeDasharray = CIRC;

  function clearStepError() {
    if (formError) { formError.hidden = true; formError.textContent = ""; }
  }

  function showStep(index) {
    dataSteps.forEach(function (s, i) {
      s.classList.toggle("active", i === index);
    });
    if (resultStep) resultStep.classList.remove("active");
    btnBack.hidden = index === 0;
    btnNext.innerHTML = (index === total - 1)
      ? "Envoyer ma demande"
      : 'Suivant <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    updateGauge(index);
    clearStepError();
  }

  function updateGauge(index) {
    var pct = Math.round(((index) / total) * 100);
    var offset = CIRC - (pct / 100) * CIRC;
    if (gaugeCircle) gaugeCircle.style.strokeDashoffset = offset;
    if (gaugePct) gaugePct.textContent = pct + "%";
  }

  function validateStep(index) {
    var step = dataSteps[index];
    var field = step.querySelector("select, input:not([type=checkbox])");
    var grid = step.querySelector(".choice-grid");

    if (grid) {
      var key = grid.getAttribute("data-field");
      if (!wizardData[key]) {
        showError("Merci de sélectionner une option pour continuer.");
        return false;
      }
      return true;
    }

    // Last step: contact info (multiple fields)
    var inputs = step.querySelectorAll("input[required], select[required]");
    if (inputs.length > 1) {
      for (var i = 0; i < inputs.length; i++) {
        var el = inputs[i];
        if (el.type === "checkbox") {
          if (!el.checked) { showError("Merci d'accepter les conditions pour continuer."); return false; }
          continue;
        }
        if (!el.value || (el.checkValidity && !el.checkValidity())) {
          showError("Merci de vérifier les informations saisies (téléphone, email, code postal).");
          el.focus();
          return false;
        }
      }
      return true;
    }

    if (field) {
      if (!field.value || (field.checkValidity && !field.checkValidity())) {
        showError("Merci de renseigner ce champ pour continuer.");
        field.focus();
        return false;
      }
    }
    return true;
  }

  function showError(msg) {
    if (!formError) return;
    formError.textContent = msg;
    formError.hidden = false;
  }

  btnNext.addEventListener("click", function () {
    if (!validateStep(current)) return;

    if (current < total - 1) {
      current++;
      showStep(current);
    } else {
      // final submit
      submitEstimation();
    }
  });

  btnBack.addEventListener("click", function () {
    if (current > 0) {
      current--;
      showStep(current);
    }
  });

  if (dataSteps.length) {
    dataSteps[0].classList.add("active");
    showStep(0);
  }

  function submitEstimation() {
    // No real price is shown here: without live listings for the
    // person's region to compare against, a client-side number would
    // just be invented. Instead we confirm the request and hand off
    // to a human advisor who calls back with a real, comparison-based
    // offer within 24-48h.
    dataSteps.forEach(function (s) { s.classList.remove("active"); });
    if (resultStep) resultStep.classList.add("active");

    var nav = document.querySelector(".wizard-nav");
    if (nav) nav.style.display = "none";

    if (gaugeCircle) gaugeCircle.style.strokeDashoffset = 0;
    if (gaugePct) gaugePct.textContent = "100%";

    // NOTE: no backend is configured. Hook this up to your CRM / email
    // service (e.g. a serverless function, Formspree, HubSpot, etc.)
    // to actually receive and route incoming leads.
  }

  /* ============================================================
     Contact form (front-end only demo submission)
     ============================================================ */
  var contactForm = document.getElementById("contactForm");
  var contactSuccess = document.getElementById("contactSuccess");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      contactForm.reset();
      if (contactSuccess) contactSuccess.hidden = false;
      // NOTE: no backend is configured — wire this up to your email/CRM
      // service to actually receive messages.
    });
  }
})();
