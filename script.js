// SAGOR CHANDRA COUCH — PORTFOLIO INTERACTIONS
"use strict";

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// Mobile navigation
const menuButton = $(".menu-button");
const navLinks = $(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuButton.textContent = isOpen ? "×" : "☰";
  });

  $$(".nav-links a").forEach(link => link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.textContent = "☰";
  }));
}

// Highlight the navigation link for the visible section
const sections = $$("main section[id]");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$(".nav-links a").forEach(link => {
        link.classList.toggle("active-link", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => sectionObserver.observe(section));
}

// Reveal content as it enters the viewport
const revealItems = $$(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("show"));
}

// Back-to-top button
const topButton = $(".back-to-top");
if (topButton) {
  const updateTopButton = () => topButton.classList.toggle("visible", window.scrollY > 450);
  window.addEventListener("scroll", updateTopButton, { passive: true });
  updateTopButton();
  topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// Footer year
const year = $("#year");
if (year) year.textContent = new Date().getFullYear();

// Contact form: opens the visitor's email application
const contactForm = $("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const name = $("#sender-name").value.trim();
    const email = $("#sender-email").value.trim();
    const subject = $("#subject").value.trim();
    const message = $("#message").value.trim();
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailto = `mailto:sonatonsagor@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}

// Project detail dialog
const projectData = {
  waste: {
    title: "Smart Waste Monitor System",
    description: "An Arduino-based smart dustbin that monitors the waste level and controls its lid automatically.",
    extra: "The planned system uses ultrasonic sensors to measure the waste level, a servo motor for lid movement, an LCD to show the waste percentage, and a gas sensor and buzzer for alerts. Manual control is also included when the bin reaches its full level."
  },
  dengue: {
    title: "Dengue Outbreak Prediction",
    description: "A research project focused on dengue outbreak prediction in Bangladesh using a spatiotemporal machine learning approach.",
    extra: "The research uses longitudinal surveillance data and focuses on 7-day and 10-day outbreak prediction. Areas of work include data analysis and machine learning."
  },
  network: {
    title: "Enterprise Network Design",
    description: "A Cisco Packet Tracer project demonstrating a segmented enterprise network with two router sections and multiple department VLANs.",
    extra: "The design includes router-on-a-stick inter-VLAN routing, DNS and web server services, and access-control rules that manage which departments can communicate with one another."
  }
};

const modal = $("#project-modal");
const modalTitle = $("#modal-title");
const modalDescription = $("#modal-description");
const modalExtra = $("#modal-extra");
const closeModalButton = $(".modal-close");

function openProject(key) {
  const project = projectData[key];
  if (!project || !modal) return;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalExtra.textContent = project.extra;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  if (closeModalButton) closeModalButton.focus();
}

function closeProject() {
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

$$("[data-project]").forEach(button => {
  button.addEventListener("click", () => openProject(button.dataset.project));
});
if (closeModalButton) closeModalButton.addEventListener("click", closeProject);
if (modal) {
  modal.addEventListener("click", event => {
    if (event.target === modal) closeProject();
  });
}
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeProject();
});

// Light/dark theme with safe storage fallback
const themeToggle = $("#theme-toggle");
const storageKey = "sagor-portfolio-theme-v6";

function setTheme(theme) {
  document.body.classList.toggle("dark-theme", theme === "dark");
  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "☼" : "☾";
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    themeToggle.title = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  }
}

let savedTheme = "light";
try {
  savedTheme = localStorage.getItem(storageKey) || "light";
} catch (error) {
  // Storage may be disabled; the page still works with the default theme.
}
setTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    setTheme(nextTheme);
    try { localStorage.setItem(storageKey, nextTheme); } catch (error) { /* Ignore storage errors. */ }
  });
}

// Small typing effect
const typingTarget = $("#typing-text");
const roles = ["CSE Student", "Aspiring Software Engineer", "Problem Solver"];
if (typingTarget && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let roleIndex = 0, charIndex = roles[0].length, deleting = true;
  const typeNext = () => {
    const current = roles[roleIndex];
    if (deleting) {
      charIndex--;
      typingTarget.textContent = current.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    } else {
      const next = roles[roleIndex];
      charIndex++;
      typingTarget.textContent = next.slice(0, charIndex);
      if (charIndex >= next.length) deleting = true;
    }
    window.setTimeout(typeNext, deleting ? 75 : 105);
  };
  window.setTimeout(typeNext, 1800);
}

console.log("Sagor's portfolio loaded.");
