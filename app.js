let fileInput = document.getElementById('fileInput');
let canvas = document.getElementById('canvas');
let context = canvas.getContext("2d");
let brightnessInput = document.getElementById('brightness');
let rotateInput = document.getElementById('rotate');
let contrastInput = document.getElementById('contrast');
let saturationInput = document.getElementById('saturation');
let blurInput = document.getElementById('blur');
let inversionInput = document.getElementById('inversion');
let cropBtn = document.getElementById("cropBtn");
let doneBtn = document.getElementById("doneBtn");
let saveBtn = document.getElementById("saveBtn");
let saveModal = document.getElementById("saveModal");
let formatSelect = document.getElementById("formatSelect");
let downloadBtn = document.getElementById("downloadBtn");
let zoomInput = document.getElementById("zoom");
let zoomValueDisplay = document.getElementById("zoomValue");

let image = null;
let cropper = null;
const MAX_WIDTH = 500;
let settings = { brightness: 100, contrast: 100, saturation: 100, blur: 0, inversion: 0, rotate: 0, zoom: 1 };

let resetSettings = () => {
    settings = { brightness: 100, contrast: 100, saturation: 100, blur: 0, inversion: 0, rotate: 0, zoom: 1 };

    // Reset all input values
    brightnessInput.value = 100;
    contrastInput.value = 100;
    saturationInput.value = 100;
    blurInput.value = 0;
    inversionInput.value = 0;
    rotateInput.value = 0;
    zoomInput.value = 1;

    // Reset text labels
    document.getElementById("brightnessValue").textContent = 100;
    document.getElementById("brightnessValue").style.left = "100px";
    document.getElementById("contrastValue").textContent = 100;
    document.getElementById("contrastValue").style.left = "100px";
    document.getElementById("saturationValue").textContent = 100;
    document.getElementById("saturationValue").style.left = "100px";
    document.getElementById("blurValue").textContent = 0;
    document.getElementById("blurValue").style.left = '0px';
    document.getElementById("inversionValue").textContent = 0;
    document.getElementById("inversionValue").style.left = '0px';
    document.getElementById("rotateValue").textContent = 0;
    document.getElementById("rotateValue").style.left = '0px';
    document.getElementById("zoomValue").textContent = "1x";
    document.getElementById("zoomValue").style.left = "1px";



    // Ensure the image is redrawn after reset
    if (image) {
        imageInsideCanvas();
    }
};


let generateFilters = () => {
    return `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%) invert(${settings.inversion}%) blur(${settings.blur}px) rotate((${settings.rotate}deg)`;
};

let imageInsideCanvas = () => {
    if (!image || image.width === 0 || image.height === 0) {
        console.log("No image loaded yet!");
        return;
    }

    let scaleFactor = image.width > MAX_WIDTH ? MAX_WIDTH / image.width : 1;
    let newWidth = image.width * scaleFactor * settings.zoom;
    let newHeight = image.height * scaleFactor * settings.zoom;

    let angle = settings.rotate * Math.PI / 180;

    let rotatedWidth = Math.abs(newWidth * Math.cos(angle)) + Math.abs(newHeight * Math.sin(angle));
    let rotatedHeight = Math.abs(newWidth * Math.sin(angle)) + Math.abs(newHeight * Math.cos(angle));

    canvas.width = rotatedWidth;
    canvas.height = rotatedHeight;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.filter = `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%) invert(${settings.inversion}%) blur(${settings.blur}px)`;

    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(angle);
    context.drawImage(image, -newWidth / 2, -newHeight / 2, newWidth, newHeight);
    context.restore();
};

function updateSliderValue(slider, valueSpan) {
    valueSpan.textContent = slider.value;
    // Position the number dynamically based on slider thumb
    let percent = (slider.value - slider.min) / (slider.max - slider.min);
    let sliderWidth = slider.offsetWidth;
    let newPosition = percent * sliderWidth - 10; // Adjust offset to center the number

    valueSpan.style.left = `${newPosition}px`;
}

brightnessInput.addEventListener("input", () => {
    updateSliderValue(brightnessInput, document.getElementById("brightnessValue"));
    settings.brightness = brightnessInput.value;
    imageInsideCanvas();
});

contrastInput.addEventListener("input", () => {
    updateSliderValue(contrastInput, document.getElementById("contrastValue"));
    settings.contrast = contrastInput.value;
    imageInsideCanvas();
});

saturationInput.addEventListener("input", () => {
    updateSliderValue(saturationInput, document.getElementById("saturationValue"));
    settings.saturation = saturationInput.value;
    imageInsideCanvas();
});

blurInput.addEventListener("input", () => {
    updateSliderValue(blurInput, document.getElementById("blurValue"));
    settings.blur = blurInput.value;
    imageInsideCanvas();
});

inversionInput.addEventListener("input", () => {
    updateSliderValue(inversionInput, document.getElementById("inversionValue"));
    settings.inversion = inversionInput.value;
    imageInsideCanvas();
});

rotateInput.addEventListener("input", () => {
    updateSliderValue(rotateInput, document.getElementById("rotateValue"));
    settings.rotate = rotateInput.value;
    imageInsideCanvas();
});

zoomInput.addEventListener("input", () => {
    updateSliderValue(zoomInput, document.getElementById("zoomValue"));
    settings.zoom = zoomInput.value;
    imageInsideCanvas();
});

fileInput.addEventListener("change", () => {
    if (fileInput.files.length === 0) return;

    image = new Image();
    image.src = URL.createObjectURL(fileInput.files[0]);

    image.onload = () => {
        console.log("Image loaded:", image.src);

        resetSettings();
        settings.zoom = 1;
        zoomInput.value = 1;
        zoomValueDisplay.textContent = "1x";

        imageInsideCanvas();
    };
});

cropBtn.addEventListener("click", () => {
    if (cropper) cropper.destroy();
    cropper = new Cropper(canvas, {
        viewMode: 1,
        aspectRatio: NaN,
        movable: true,
        zoomable: true,
        scalable: true,
        rotatable: true,
    });
    cropBtn.style.display = "none";
    doneBtn.style.display = "block";
});

doneBtn.addEventListener("click", () => {
    if (!cropper) return;
    let croppedCanvas = cropper.getCroppedCanvas();
    if (!croppedCanvas) return;

    let newWidth = croppedCanvas.width;
    let newHeight = croppedCanvas.height;

    canvas.width = newWidth;
    canvas.height = newHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(croppedCanvas, 0, 0, newWidth, newHeight);

    cropper.destroy();
    cropper = null;

    doneBtn.style.display = "none";
    cropBtn.style.display = "block";
    saveBtn.style.display = "block";
});

saveBtn.addEventListener("click", () => {
    saveModal.style.display = "flex";
});

downloadBtn.addEventListener("click", () => {
    let format = formatSelect.value;
    let link = document.createElement("a");
    link.download = `image.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
    saveModal.style.display = "none";
});

function resetSettingAll() {
    resetSettings();
    if (image) {
        imageInsideCanvas();
    }
}

function closeModal() {
    saveModal.style.display = "none";
}