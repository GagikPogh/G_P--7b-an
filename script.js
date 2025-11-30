const canvas = document.querySelector(".hero-orbs");
const ctx = canvas.getContext("2d");
const orbs = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

function createOrb() {
  const hue = Math.random() * 40 + 10;
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 120 + 40,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    color: `hsla(${hue}, 80%, 60%, 0.15)`,
  };
}

for (let i = 0; i < 12; i++) {
  orbs.push(createOrb());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  orbs.forEach((orb) => {
    ctx.beginPath();
    ctx.fillStyle = orb.color;
    ctx.shadowColor = orb.color;
    ctx.shadowBlur = 60;
    ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
    ctx.fill();

    orb.x += orb.dx;
    orb.y += orb.dy;

    if (orb.x - orb.r < 0 || orb.x + orb.r > canvas.width) orb.dx *= -1;
    if (orb.y - orb.r < 0 || orb.y + orb.r > canvas.height) orb.dy *= -1;
  });
  requestAnimationFrame(animate);
}

animate();

// Reveal on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".section, .hero").forEach((el) => {
  observer.observe(el);
});

// Gallery marquee & preview
const galleryMarquee = document.getElementById("galleryMarquee");
if (galleryMarquee) {
  const track = galleryMarquee.querySelector(".gallery-track");
  if (track) {
    track.innerHTML += track.innerHTML;
    const preview = document.createElement("div");
    preview.id = "galleryPreview";
    document.body.appendChild(preview);

    const positionPreview = (target) => {
      const rect = target.getBoundingClientRect();
      const previewWidth = 300;
      const previewHeight = 260;
      let left = rect.right + 16;
      let top = rect.top + rect.height / 2 - previewHeight / 2;

      if (left + previewWidth > window.innerWidth - 16) {
        left = rect.left - previewWidth - 16;
      }
      if (top < 16) {
        top = 16;
      } else if (top + previewHeight > window.innerHeight - 16) {
        top = window.innerHeight - previewHeight - 16;
      }

      preview.style.left = `${left}px`;
      preview.style.top = `${top}px`;
    };

    const hidePreview = () => {
      preview.classList.remove("active");
    };

    const showPreview = (item) => {
      const { full, title, desc, price, link } = item.dataset;
      preview.innerHTML = `
        <img src="${full}" alt="${title}" />
        <strong>${title || ""}</strong>
        <p>${desc || ""}</p>
        <small>${price || ""}</small>
        ${link ? `<a href="${link}" target="_blank" rel="noreferrer">Գնել</a>` : ""}
      `;
      preview.classList.add("active");
      positionPreview(item);
    };

    galleryMarquee.querySelectorAll(".gallery-item").forEach((item) => {
      item.addEventListener("mouseenter", () => showPreview(item));
      item.addEventListener("mousemove", () => positionPreview(item));
      item.addEventListener("mouseleave", hidePreview);
    });
  }
}

// Price ticker
const priceTickerLabel = document.getElementById("priceTickerLabel");
if (priceTickerLabel) {
  const priceTickerLink = document.getElementById("priceTickerLink");
  const priceSlides = [
    {
      text: "Թղթե Դոմինո · 6 900 AMD · Պատվիրել PIK",
      link: "https://www.pik.am/7xax.html",
    },
    {
      text: "Գտիր ավելորդը · 5 500 AMD · Zangak",
      link: "https://zangakbookstore.am/ru/search?q=%D5%85%D5%B8%D5%A9",
    },
    {
      text: "Մաթ-ֆուտբոլ · 8 100 AMD · BALU առաքում",
      link: "https://www.balu.am/product/%d5%bd%d5%a5%d5%b2%d5%a1%d5%b6%d5%ab-%d5%a6%d5%be%d5%a1%d6%80%d5%b3%d5%a1%d5%ac%d5%ab-%d5%ad%d5%a1%d5%b2-2/",
    },
    {
      text: "Mini Math Fut · 4 900 AMD · Books.am",
      link: "https://www.books.am",
    },
  ];
  let tickerIndex = 0;
  const updateTicker = () => {
    const slide = priceSlides[tickerIndex];
    priceTickerLabel.textContent = slide.text;
    if (priceTickerLink) {
      priceTickerLink.href = slide.link;
    }
    tickerIndex = (tickerIndex + 1) % priceSlides.length;
  };
  updateTicker();
  setInterval(updateTicker, 4500);
}

// Неоновый след за курсором
const cursorTrail = [];
const trailLength = 20;
let hue = 0;

document.addEventListener("mousemove", (e) => {
  hue = (hue + 2) % 360;
  cursorTrail.push({
    x: e.clientX,
    y: e.clientY,
    time: Date.now(),
    hue: hue,
  });
  
  if (cursorTrail.length > trailLength) {
    cursorTrail.shift();
  }
});

function drawCursorTrail() {
  const now = Date.now();
  const trailCanvas = document.getElementById("cursorTrail");
  if (!trailCanvas) return;
  
  const ctx = trailCanvas.getContext("2d");
  ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  
  cursorTrail.forEach((point, index) => {
    const age = (now - point.time) / 1000; // возраст в секундах
    if (age > 1.5) {
      cursorTrail.splice(index, 1);
      return;
    }
    
    const opacity = 1 - (age / 1.5);
    const size = 8 * (1 - age / 1.5);
    
    ctx.beginPath();
    ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${point.hue}, 100%, 60%, ${opacity * 0.6})`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = `hsl(${point.hue}, 100%, 60%)`;
    ctx.fill();
  });
  
  requestAnimationFrame(drawCursorTrail);
}

// Создаем canvas для следа
const trailCanvas = document.createElement("canvas");
trailCanvas.id = "cursorTrail";
trailCanvas.style.position = "fixed";
trailCanvas.style.top = "0";
trailCanvas.style.left = "0";
trailCanvas.style.width = "100%";
trailCanvas.style.height = "100%";
trailCanvas.style.pointerEvents = "none";
trailCanvas.style.zIndex = "9999";
trailCanvas.width = window.innerWidth;
trailCanvas.height = window.innerHeight;
document.body.appendChild(trailCanvas);

window.addEventListener("resize", () => {
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
});

drawCursorTrail();

