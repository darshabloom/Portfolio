// -----------------------------------------------------
// INTERACTIVE DOT / CONNECTION BACKGROUND
// -----------------------------------------------------
const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let width = 0;
let height = 0;
let dpr = 1;
let nodes = [];
let pointer = { x: -9999, y: -9999, active: false };
let accent = "default";

const palettes = {
  default: {
    dots: ["#72bfa1", "#78b7dc", "#6f95c9", "#89c9b1"],
    line: "rgba(92, 125, 138, .18)",
    pointer: "#4b947c"
  },
  green: {
    dots: ["#4c8758", "#78a86c", "#608a8c", "#7a9276"],
    line: "rgba(53,109,64,.22)",
    pointer: "#295a34"
  },
  blue: {
    dots: ["#3c5f9a", "#608fbd", "#7188b2", "#5d7394"],
    line: "rgba(44,83,142,.22)",
    pointer: "#244c86"
  },
  lilac: {
    dots: ["#795f98", "#9781ac", "#768ba8", "#907790"],
    line: "rgba(111,80,145,.21)",
    pointer: "#684984"
  },
  pink: {
    dots: ["#9f5e78", "#b27589", "#a98272", "#8f6c7d"],
    line: "rgba(143,73,100,.2)",
    pointer: "#873e5b"
  },
  orange: {
    dots: ["#9d6f42", "#a98258", "#9e6c65", "#8f765a"],
    line: "rgba(145,91,47,.2)",
    pointer: "#81512b"
  }
};

function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const desired = Math.max(55, Math.min(135, Math.floor((width * height) / 13000)));
  nodes = Array.from({ length: desired }, (_, i) => createNode(i));
}

function createNode(i) {
  const x = Math.random() * width;
  const y = Math.random() * height;

  return {
    x,
    y,
    baseX: x,
    baseY: y,
    vx: (Math.random() - .5) * .18,
    vy: (Math.random() - .5) * .18,
    radius: 0.8 + Math.random() * 2.4,
    colourIndex: i % 4
  };
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function drawNetwork() {
  ctx.clearRect(0, 0, width, height);

  const palette = palettes[accent] || palettes.default;
  const linkRadius = width < 700 ? 92 : 125;
  const pointerRadius = width < 700 ? 0 : 260;

  // move nodes
  if (!reduceMotion) {
    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < -20) n.x = width + 20;
      if (n.x > width + 20) n.x = -20;
      if (n.y < -20) n.y = height + 20;
      if (n.y > height + 20) n.y = -20;

      if (pointer.active) {
        const dx = n.x - pointer.x;
        const dy = n.y - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < pointerRadius && dist > 0.1) {
          const force = (pointerRadius - dist) / pointerRadius;

          // stronger invisible repulsion
          const push = force * force * 10;

          n.x += (dx / dist) * push;
          n.y += (dy / dist) * push;
        }
      }

      // gently return towards original position
      n.x += (n.baseX - n.x) * 0.006;
      n.y += (n.baseY - n.y) * 0.006;
    });
  }

  // links between nodes
  // ctx.lineWidth = 1;
  // for (let i = 0; i < nodes.length; i++) {
  //   for (let j = i + 1; j < nodes.length; j++) {
  //     const dist = distance(nodes[i], nodes[j]);
  //     if (dist < linkRadius) {
  //       ctx.strokeStyle = palette.line.replace(
  //         /[\d.]+\)$/,
  //         `${Math.max(.035, (1 - dist / linkRadius) * .28)})`
  //       );
  //       ctx.beginPath();
  //       ctx.moveTo(nodes[i].x, nodes[i].y);
  //       ctx.lineTo(nodes[j].x, nodes[j].y);
  //       ctx.stroke();
  //     }
  //   }
  // }

  // cursor becomes a large network node and creates obvious connections
  // if (pointer.active && pointerRadius > 0) {
  //   nodes.forEach((n) => {
  //     const dist = Math.hypot(n.x - pointer.x, n.y - pointer.y);
  //     if (dist < pointerRadius) {
  //       const alpha = .62 * (1 - dist / pointerRadius);
  //       ctx.strokeStyle = palette.pointer.replace?.(")", `,${alpha})`) || palette.pointer;
  //       ctx.strokeStyle = `rgba(${hexToRgb(palette.pointer)},${alpha})`;
  //       ctx.lineWidth = 1.35;
  //       ctx.beginPath();
  //       ctx.moveTo(pointer.x, pointer.y);
  //       ctx.lineTo(n.x, n.y);
  //       ctx.stroke();
  //     }
  //   });

  //   const grad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 48);
  //   grad.addColorStop(0, `rgba(${hexToRgb(palette.pointer)},.18)`);
  //   grad.addColorStop(1, `rgba(${hexToRgb(palette.pointer)},0)`);
  //   ctx.fillStyle = grad;
  //   ctx.beginPath();
  //   ctx.arc(pointer.x, pointer.y, 48, 0, Math.PI * 2);
  //   ctx.fill();

  //   ctx.fillStyle = palette.pointer;
  //   ctx.beginPath();
  //   ctx.arc(pointer.x, pointer.y, 4.2, 0, Math.PI * 2);
  //   ctx.fill();
  // }

  // dots
  // nodes.forEach((n) => {
  //   ctx.fillStyle = palette.dots[n.colourIndex];
  //   ctx.globalAlpha = .82;
  //   ctx.beginPath();
  //   ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
  //   ctx.fill();
  // });
  // ctx.globalAlpha = 1;

  requestAnimationFrame(drawNetwork);
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map(c => c + c).join("") : value;
  const num = parseInt(full, 16);
  return `${(num >> 16) & 255},${(num >> 8) & 255},${num & 255}`;
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  pointer.active = true;
});
window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

resizeCanvas();
drawNetwork();

// -----------------------------------------------------
// PROJECT HOVER CHANGES NETWORK PALETTE
// -----------------------------------------------------
document.querySelectorAll(".project[data-accent]").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    accent = card.dataset.accent || "default";
  });

  card.addEventListener("mouseleave", () => {
    accent = "default";
  });
});

// -----------------------------------------------------
// SMOOTH LIGHT TRAIL CURSOR REACTION
// -----------------------------------------------------

const trails = [...document.querySelectorAll(".trail")];

const trailState = trails.map(() => ({
  currentX: 0,
  currentY: 0,
  targetX: 0,
  targetY: 0
}));

let trailMouseX = -9999;
let trailMouseY = -9999;

window.addEventListener("pointermove", (e) => {
  trailMouseX = e.clientX;
  trailMouseY = e.clientY;
});

window.addEventListener("pointerleave", () => {
  trailMouseX = -9999;
  trailMouseY = -9999;
});

function updateTrailInteraction() {
  trails.forEach((trail, index) => {
    const rect = trail.getBoundingClientRect();

    const trailX = rect.left + rect.width / 2;
    const trailY = rect.top + rect.height / 2;

    const dx = trailX - trailMouseX;
    const dy = trailY - trailMouseY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const influenceRadius = 520;

    if (distance < influenceRadius && distance > 0.1) {
      const strength =
        (influenceRadius - distance) / influenceRadius;

      const directionX = dx / distance;
      const directionY = dy / distance;

      const pushAmount = strength * strength * 65;

      trailState[index].targetX =
        directionX * pushAmount;

      trailState[index].targetY =
        directionY * pushAmount;
    } else {
      trailState[index].targetX = 0;
      trailState[index].targetY = 0;
    }

    // smooth easing
    trailState[index].currentX +=
      (trailState[index].targetX - trailState[index].currentX) * 0.08;

    trailState[index].currentY +=
      (trailState[index].targetY - trailState[index].currentY) * 0.08;

    trail.style.transform =
      `translate(${trailState[index].currentX}px, ${trailState[index].currentY}px)`;
  });

  requestAnimationFrame(updateTrailInteraction);
}

updateTrailInteraction();

// -----------------------------------------------------
// CAROUSELS
// -----------------------------------------------------
document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".slide")];
  const prev = carousel.querySelector(".prev");
  const next = carousel.querySelector(".next");
  const dots = carousel.querySelector(".carousel-dots");

  let index = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show image ${i + 1}`);
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      show(i);
      restart();
    });

    dots.appendChild(dot);
  });

  const dotButtons = [...dots.querySelectorAll("button")];

  function show(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
    dotButtons.forEach((dot, i) => dot.classList.toggle("active", i === index));
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => show(index + 1), 4300);
  }

  prev.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    show(index - 1);
    restart();
  });

  next.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    show(index + 1);
    restart();
  });

  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", restart);

  restart();
});

// -----------------------------------------------------
// PLACEHOLDER LINKS
// -----------------------------------------------------
document.addEventListener("click", (event) => {
  const placeholder = event.target.closest("[data-placeholder-link]");
  if (!placeholder) return;

  event.preventDefault();
  alert("Replace this placeholder with your real link before publishing.");
});

const cvModal = document.getElementById("cvModal");
const cvOpenButtons = document.querySelectorAll(".cv-open");
const cvClose = document.querySelector(".cv-close");
const cvBackdrop = document.querySelector(".cv-modal-backdrop");

function openCV() {
  cvModal.classList.add("open");
  cvModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCV() {
  cvModal.classList.remove("open");
  cvModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

cvOpenButtons.forEach((button) => {
  button.addEventListener("click", openCV);
});
cvClose.addEventListener("click", closeCV);
cvBackdrop.addEventListener("click", closeCV);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && cvModal.classList.contains("open")) {
    closeCV();
  }
});