let fileInput = document.getElementById('fileInput');
let canvas = document.getElementById('canvas');
let context = canvas.getContext("2d");
let brightnessInput = document.getElementById('brightness');
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

let image = null;
let cropper = null;
const MAX_WIDTH = 500;
let settings = { brightness: 100, contrast: 100, saturation: 100, blur: 0, inversion: 0 };

let resetSettings = () => {
    settings = { brightness: 100, contrast: 100, saturation: 100, blur: 0, inversion:0 };
    brightnessInput.value = 100;
    contrastInput.value = 100;
    saturationInput.value = 100;
    blurInput.value = 0;
    inversionInput.value = 0;
    document.getElementById("brightnessValue").textContent = 100;
    document.getElementById("contrastValue").textContent = 100;
    document.getElementById("saturationValue").textContent = 100;
    document.getElementById("blurValue").textContent = 0;
    document.getElementById("inversionValue").textContent = 0;
};

let generateFilters = () => {
    return `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%) invert(${settings.inversion}%) blur(${settings.blur}px)`;
};

let imageInsideCanvas = () => {
    let scaleFactor = image.width > MAX_WIDTH ? MAX_WIDTH / image.width : 1;
    let newWidth = image.width * scaleFactor;
    let newHeight = image.height * scaleFactor;

    canvas.width = newWidth;
    canvas.height = newHeight;

    context.filter = generateFilters();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, newWidth, newHeight);
};

brightnessInput.addEventListener("input", () => {
    document.getElementById("brightnessValue").textContent = brightnessInput.value;
    document.getElementById("brightnessValue").style.left=`${brightnessInput.value}px`;
    settings.brightness = brightnessInput.value;
    imageInsideCanvas();
});
contrastInput.addEventListener("input", () => {
    document.getElementById("contrastValue").textContent = contrastInput.value;
    document.getElementById("contrastValue").style.left=`${contrastInput.value}px`;
    settings.contrast = contrastInput.value;
    imageInsideCanvas();
});
saturationInput.addEventListener("input", () => {
    document.getElementById("saturationValue").textContent = saturationValue.value;
    document.getElementById("saturationValue").style.left=`${saturationValue.value}%`;
    settings.saturation = saturationInput.value;
    imageInsideCanvas();
});
blurInput.addEventListener("input", () => {
    document.getElementById("blurValue").textContent = blurInput.value;
    document.getElementById("blurValue").style.left=`${blurInput.value*10}%`;
    settings.blur = blurInput.value;
    imageInsideCanvas();
});
inversionInput.addEventListener("input", () => {
    document.getElementById("inversionValue").textContent = inversionInput.value;
    document.getElementById("inversionValue").style.left=`${inversionInput.value}px`;
    settings.inversion = inversionInput.value;
    imageInsideCanvas();
});

fileInput.addEventListener("change", () => {
    image = new Image();
    image.addEventListener("load", () => {
        resetSettings();
        imageInsideCanvas();
    });
    image.src = URL.createObjectURL(fileInput.files[0]);
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