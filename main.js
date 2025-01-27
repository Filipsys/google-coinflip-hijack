// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-01-26
// @description  try to take over the world!
// @author       You
// @match        https://www.google.com/search?q=coin+flip
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at document-end
// ==/UserScript==

(async function() {
    'use strict';

    const imagesLink = "https://www.google.com/logos/fnbx/coin_flip/coin_sheet.png"
    const imageYLocations = [
        0, 150, 300, 450, 600,
        750, 900, 1050, 1200,
        1350, 1500, 1650, 1800,
        1950, 2100, 2250, 2400
    ];
    const resultIndicies = {
        heads: 0, tails: 8
    };

    let rotationDirection = "clockwise"; // counter-clockwise or clockwise
    let flipDirection = "clockwise";
    let desiredResult = "tails";
    let spinningTimeInMs = 3000;
    let maxFullRotationCount = 5;
    let maxFullSpinCount = 5;
    let rotationSpeed = 4;
    let flipSpeed = 1;
    let canvasFound = false;
    let currentImageIndex = 0;
    let currentFullRotationCount = 0;
    let currentFullSpinCount = 0;
    let rotation = 0;
    let timeStart = 0;
    let canvas;

    let timePerSpin = spinningTimeInMs / maxFullSpinCount;
    let timePerFrame = timePerSpin / 18 // There are 18 frames in the image

    /* const randomPresets = [
        {
            spinningTimeInMs: 1000,
            maxFullRotationCount: 2
        }, {
            spinningTimeInMs: 3000,
            maxFullRotationCount: 4,
            maxFullSpinCount: 6
        }, {
            spinningTimeInMs: 3000,
            maxFullRotationCount: 3
        }, {
            spinningTimeInMs: 3000,
            maxFullRotationCount: 1
        }
    ] */

    while (!canvasFound) {
        canvas = document.querySelector("canvas");
        if (canvas) canvasFound = true;

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const newImages = document.querySelector("img[src='/logos/fnbx/coin_flip/coin_sheet.png']");
    newImages.style.display = "none";

    const newCanvas = document.createElement("canvas");
    const ctx = newCanvas.getContext('2d');
    newCanvas.width = 150
    newCanvas.height = 150
    newCanvas.zIndex = "1000"
    canvas.replaceWith(newCanvas);

    const playLoop = () => {
//        const timeNow = Date.now();
//        if (timeNow > timeStart + spinningTimeInMs) {
//            if (currentImageIndex == resultIndicies[desiredResult]) return cancelAnimationFrame(playLoop)
//        }
        if (currentFullRotationCount >= maxFullRotationCount) return cancelAnimationFrame(playLoop)

        ctx.clearRect(0, 0, 150, 150);

        ctx.save();
        ctx.translate(75, 75);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-75, -75);

        ctx.restore();

        if (flipDirection == "clockwise") {
            if (currentImageIndex < imageYLocations.length - 1) {
                currentImageIndex = currentImageIndex + flipSpeed;
            } else {
                currentImageIndex = 0;
                currentFullSpinCount++;
            }
        } else {
            if (currentImageIndex <= 0) {
                currentImageIndex = imageYLocations.length - 1;
                currentFullSpinCount++;
            } else {
                currentImageIndex = currentImageIndex - flipSpeed;
            }
        }

        if (rotationDirection == "clockwise") {
             if (rotation + rotationSpeed < 360) {
                 rotation = rotation + rotationSpeed;
             } else {
                 rotation = 0;
                 currentFullRotationCount++;
             }
        } else {
            if (rotation - rotationSpeed <= 0) {
                rotation = rotation - rotationSpeed;
            } else {
                rotation = 360;
                 currentFullRotationCount++;
            }
        }

        requestAnimationFrame(playLoop);
    };

    timeStart = Date.now();
    window.requestAnimationFrame(playLoop);
})();
