const clippy = document.getElementById("clippy");
const clippyImg = clippy.querySelector("img");
const clippyTooltip = clippy.querySelector(".clippy-tooltip");
let clippyStatus = "ready";

let waitingTimer = 10000;
let clippyInterval;

const initialSrc = "https://media.tenor.com/ztJ2dTLGgygAAAAi/clippy.gif";
const draggingSrc = "https://media.tenor.com/c48E2xWwC4gAAAAi/clippy.gif";
const bikeIn = {
  src: "https://media.tenor.com/qsAPDbuCR3oAAAAi/clippy.gif",
  dur: 3500
};
const bikeOut = {
  src: "https://media.tenor.com/KbPESUov9hcAAAAi/clippy.gif",
  dur: 4000
};
const waitingSrc = [
  {
    name: "atom",
    src: "https://media.tenor.com/T808PcBj4tgAAAAi/clippy.gif",
    dur: 4500
  },
  {
    name: "eyes",
    src: "https://media.tenor.com/oaGGTJ_Fmx8AAAAi/clippy.gif",
    dur: 8400
  },
  {
    name: "laze",
    src: "https://media.tenor.com/RFZS3i-LsR8AAAAi/clippy.gif",
    dur: 13800
  },
  {
    name: "music",
    src: "https://media.tenor.com/aGb3u5Mw518AAAAi/clippy.gif",
    dur: 5400
  },
  {
    name: "sleepy",
    src: "https://media.tenor.com/uA5JZjh_ofsAAAAi/clippy.gif",
    dur: 7500
  },
  {
    name: "tap",
    src: "https://media.tenor.com/Tmu1IbKTtosAAAAi/clippy.gif",
    dur: 2500
  },
  {
    name: "thinking",
    src: "https://media.tenor.com/65uqptB8qOkAAAAi/clippy.gif",
    dur: 1900
  }
];

const updateClippySrc = () => {
  if (
    clippy.classList.contains("is-hidden") ||
    clippy.classList.contains("is-active")
  ) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * (waitingSrc.length - 1));
  clippyImg.setAttribute("src", waitingSrc[randomIndex].src);
  waitingTimer = waitingSrc[randomIndex].dur;
  clippyStatus = "waiting";
};

const resetWaitingSrc = () => {
  clippyImg.setAttribute("src", initialSrc);
  clearInterval(clippyInterval);
  clippyInterval = setInterval(updateClippySrc, 10000);
  clippyStatus = "ready";
};

const showClippy = (event) => {
  event.target.setAttribute("disabled", true);
  clippyImg.setAttribute("src", bikeIn.src);
  clippy.classList.remove("is-hidden");
  setTimeout(() => {
    resetWaitingSrc();
    event.target.removeAttribute("disabled");
  }, bikeIn.dur);
};

const hideClippy = (event) => {
  event.target.setAttribute("disabled", true);
  clippyImg.setAttribute("src", bikeOut.src);
  setTimeout(() => {
    clippy.classList.add("is-hidden");
    event.target.removeAttribute("disabled");
  }, bikeOut.dur);
  clearInterval(clippyInterval);
};

const toggleClippy = (event) => {
  if (clippy.classList.contains("is-hidden")) {
    showClippy(event);
    event.target.innerText = "Hide Clippy";
  } else {
    hideClippy(event);
    event.target.innerText = "Show Clippy";
  }
};

let startX, startY;
let dragInitialized = false;

const dragClippy = (event) => {
  resetWaitingSrc();
  startX = event.clientX;
  startY = event.clientY;
  dragInitialized = false;
  document.onmouseup = closeDragElement;
  document.onmousemove = elementDrag;
};

const elementDrag = (event) => {
  var e = event || window.event;
  e.preventDefault();
  clippyStatus = "dragging";
  clippy.classList.add("is-active");
  clippyImg.setAttribute("src", draggingSrc);

  var rect = clippy.getBoundingClientRect();

  if (!dragInitialized) {
    clippy.style.right = "auto";
    clippy.style.bottom = "auto";
    clippy.style.left = rect.left + "px";
    clippy.style.top = rect.top + "px";
    startX = e.clientX;
    startY = e.clientY;
    dragInitialized = true;
    return;
  }

  var deltaX = e.clientX - startX;
  var deltaY = e.clientY - startY;
  var newLeft = rect.left + deltaX;
  var newTop = rect.top + deltaY;

  clippy.style.left = newLeft + "px";
  clippy.style.top = newTop + "px";
  startX = e.clientX;
  startY = e.clientY;
};

const closeDragElement = () => {
  document.onmouseup = null;
  document.onmousemove = null;
  clippy.classList.remove("is-active");
  resetWaitingSrc();
};

const toggleClippyTooltip = () => {
  const tooltip = clippy.querySelector(".clippy-tooltip");
  if (tooltip) tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
};

window.dragClippy = dragClippy;

window.addEventListener("load", () => {
  clippyInterval = setInterval(updateClippySrc, waitingTimer);
  clippy.addEventListener("click", () => { toggleClippyTooltip(); });
  clippy.addEventListener("mousedown", dragClippy);
});