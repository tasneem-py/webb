const pickBtn = document.getElementById("pick-color");
const errorDiv = document.getElementById("error");
const fileInput = document.getElementById("file");
const image = document.getElementById("image");
const hexVal = document.getElementById("hex-val");
const rgbVal = document.getElementById("rgb-val");
const resultBox = document.getElementById("result");
const pickedColor = document.getElementById("picked-color");
const alertBox = document.getElementById("alert");

let eyeDropper;

window.onload = () => {
  if ("EyeDropper" in window) {
    eyeDropper = new EyeDropper();
  } else {
    pickBtn.style.display = "none";
    errorDiv.textContent = "Your browser doesn't support the EyeDropper API.";
  }
};

pickBtn.addEventListener("click", async () => {
  try {
    const { sRGBHex } = await eyeDropper.open();
    const rgb = hexToRgb(sRGBHex);

    hexVal.value = sRGBHex;
    rgbVal.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    pickedColor.style.backgroundColor = sRGBHex;
    resultBox.style.display = "block";
    errorDiv.textContent = "";
  } catch (err) {
    if (!err.toString().includes("AbortError")) {
      errorDiv.textContent = err;
    }
  }
});

fileInput.addEventListener("change", () => {
  const reader = new FileReader();
  reader.onload = () => {
    image.src = reader.result;
    resultBox.style.display = "none";
  };
  reader.readAsDataURL(fileInput.files[0]);
});

function copyColor(input) {
  input.select();
  document.execCommand("copy");
  alertBox.style.transform = "scale(1)";
  setTimeout(() => {
    alertBox.style.transform = "scale(0)";
  }, 1500);
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}
