import React, { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { Slider } from "@mui/material";
import { FormModal, Button as ActionButton } from "../UI";
import { getCroppedImageFile } from "../../util/cropImage";

export default function PhotoCropModal({
  open,
  imageSrc,
  fileName = "yuva_photo.jpg",
  title = "Crop photo",
  hint = "Drag to reposition. Use the slider to zoom.",
  cancelLabel = "Cancel",
  confirmLabel = "Use photo",
  zoomLabel = "Zoom",
  onCancel,
  onConfirm,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setSaving(false);
  }, [open, imageSrc]);

  const onCropComplete = useCallback((_area, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels || saving) {
      return;
    }
    setSaving(true);
    try {
      const file = await getCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
        fileName
      );
      await onConfirm?.(file);
    } catch (e) {
      console.log("crop failed", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormModal
      open={open && Boolean(imageSrc)}
      onClose={onCancel}
      title={title}
      maxWidth="560px"
    >
      <p className="text-sm text-mutedText mb-3">{hint}</p>
      <div className="relative w-full h-[280px] sm:h-[340px] rounded-xl overflow-hidden bg-black/90">
        {imageSrc ? (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="rect"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        ) : null}
      </div>
      <div className="mt-4 px-1">
        <p className="text-xs font-medium text-mutedText mb-1">{zoomLabel}</p>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.05}
          aria-label="Zoom"
          onChange={(_event, value) => setZoom(value)}
          sx={{
            color: "var(--color-primary, #542b2b)",
            "& .MuiSlider-thumb": { width: 18, height: 18 },
          }}
        />
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-3 mt-4">
        <ActionButton
          type="button"
          variant="secondary"
          fullWidth
          onClick={onCancel}
          disabled={saving}
        >
          {cancelLabel}
        </ActionButton>
        <ActionButton
          type="button"
          fullWidth
          onClick={handleConfirm}
          disabled={!croppedAreaPixels || saving}
          loading={saving}
        >
          {confirmLabel}
        </ActionButton>
      </div>
    </FormModal>
  );
}
