// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-01-26
// @description  try to take over the world!
// @author       You
// @match        https://www.google.com/search?hl=en&q=coin%20flip
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at document-end
// ==/UserScript==

(async function () {
  "use strict";
  const imagesLink = "https://www.google.com/logos/fnbx/coin_flip/coin_sheet.png";
  const imageYLocations = [
    // May or may not be off by one
    0, 150, 300, 450, 600, 750, 900, 1050, 1200, 1350, 1500, 1650, 1800, 1950, 2100, 2250, 2400,
  ];
  let canvasFound = false;
  let canvas;
  let currentImageIndex = 0;
  let rotation = 0;

  while (!canvasFound) {
    canvas = document.querySelector("canvas");
    if (canvas) canvasFound = true;

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const newImages = document.querySelector("img[src='/logos/fnbx/coin_flip/coin_sheet.png']");
  newImages.style.display = "none";

  const newCanvas = document.createElement("canvas");
  const ctx = newCanvas.getContext("2d");
  newCanvas.width = 150;
  newCanvas.height = 150;
  newCanvas.zIndex = "1000";
  canvas.replaceWith(newCanvas);

  const playLoop = () => {
    ctx.clearRect(0, 0, 150, 150);

    ctx.save();
    ctx.translate(75, 75);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-75, -75);

    ctx.drawImage(newImages, 0, imageYLocations[currentImageIndex], 150, 150, 0, 0, 150, 150);

    ctx.restore();

    currentImageIndex = currentImageIndex < imageYLocations.length - 1 ? currentImageIndex + 1 : 0;
    rotation = rotation < 360 ? rotation + 2 : (rotation = 0);

    requestAnimationFrame(playLoop);
  };

  window.requestAnimationFrame(playLoop);
})();
