const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });

const safeBaseName = (name, fallback = "yuva_photo") => {
  const base = String(name || fallback)
    .replace(/\.[^.]+$/i, "")
    .replace(/[^\w.-]+/g, "_")
    .slice(0, 180);
  return base || fallback;
};

export const isHeicLikeFile = (file) => {
  const type = String(file?.type || "").toLowerCase();
  const name = String(file?.name || "").toLowerCase();
  return (
    type.includes("heic") ||
    type.includes("heif") ||
    /\.heic$/i.test(name) ||
    /\.heif$/i.test(name)
  );
};

export async function prepareImageFileForCrop(file) {
  if (!file) {
    throw new Error("No image selected.");
  }
  if (!isHeicLikeFile(file)) {
    return file;
  }

  const heic2any = (await import("heic2any")).default;
  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.92,
  });
  const blob = Array.isArray(converted) ? converted[0] : converted;
  if (!blob) {
    throw new Error("Could not convert HEIC image.");
  }

  return new File([blob], `${safeBaseName(file.name)}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

export const readFileAsDataUrl = async (file) => {
  const prepared = await prepareImageFileForCrop(file);
  return fileToDataUrl(prepared);
};

export async function loadImageForCrop(file) {
  const prepared = await prepareImageFileForCrop(file);
  const dataUrl = await fileToDataUrl(prepared);
  return {
    file: prepared,
    dataUrl,
    fileName: prepared.name || "yuva_photo.jpg",
  };
}

const MAX_CROP_EDGE = 1200;

export async function getCroppedImageFile(
  imageSrc,
  pixelCrop,
  fileName = "yuva_photo.jpg"
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not crop image.");
  }

  const sourceSize = Math.max(
    1,
    Math.round(Math.min(pixelCrop.width, pixelCrop.height))
  );
  const size = Math.min(MAX_CROP_EDGE, sourceSize);
  canvas.width = size;
  canvas.height = size;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size
  );

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Could not crop image."));
        }
      },
      "image/jpeg",
      0.92
    );
  });

  return new File([blob], `${safeBaseName(fileName)}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}
