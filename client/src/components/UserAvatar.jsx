import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Slider } from "@/components/ui/slider";
import Flexcol from "./section/flexcol";
import { useDispatch, useSelector } from "react-redux";
import { setProfileImage } from "@/redux/slices/user-slice";
import Flexrow from "./section/flexrow";
import ExpButton from "./buttons/exp-button";
import { cn } from "@/lib/utils";

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImg(
  imageSrc,
  croppedAreaPixels,
  rotation = 0,
  fileType = "image/jpeg",
  maxWidth = 512,
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const rotRad = rotation * (Math.PI / 180);

  // Set canvas size to match the cropped area
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  // Translate canvas origin to the center of the canvas, rotate, and then translate back
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rotRad);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  // Draw the image onto the canvas
  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
  );

  // To resize the final image, we draw it onto another canvas
  const finalCanvas = document.createElement("canvas");
  const finalCtx = finalCanvas.getContext("2d");

  let targetWidth = croppedAreaPixels.width;
  let targetHeight = croppedAreaPixels.height;

  if (targetWidth > maxWidth) {
    const scaleFactor = maxWidth / targetWidth;
    targetWidth = maxWidth;
    targetHeight = croppedAreaPixels.height * scaleFactor;
  }

  finalCanvas.width = targetWidth;
  finalCanvas.height = targetHeight;

  finalCtx.drawImage(
    canvas,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    targetWidth,
    targetHeight,
  );

  return new Promise((resolve, reject) => {
    finalCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = "avatar.jpeg";
        resolve(blob);
      },
      fileType,
      0.8,
    );
  });
}

// --- The Main Component in JavaScript ---

const UserAvatar = ({ isSettings }) => {
  const dispatch = useDispatch();
  const { profileImageUrl, loading, error } = useSelector(
    (state) => state.user,
  );
  const finalAvatarUrl = profileImageUrl;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

  // State for react-easy-crop (no types)
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setIsEditorOpen(true);
        setIsMenuOpen(false);
      });
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
  });

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpload = async () => {
    if (croppedAreaPixels && imgSrc) {
      try {
        const croppedImageBlob = await getCroppedImg(
          imgSrc,
          croppedAreaPixels,
          rotation,
        );

        const formData = new FormData();
        formData.append("avatar", croppedImageBlob, "avatar.jpeg");
        await dispatch(setProfileImage({ formData })).unwrap();
        setIsEditorOpen(false);
      } catch (uploadError) {
        console.error("Failed to upload avatar:", uploadError);
      } finally {
        // Reset state
        setImgSrc("");
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
      }
    }
  };

  const handleRemove = () => {
    console.log("Removing photo...");
    setIsMenuOpen(false);
  };

  return (
    <>
      <Flexrow className={"flex-wrap items-end"}>
        <Avatar
          className={cn(
            "m-2 size-[60px] cursor-default rounded-md",
            isSettings && "m-0 size-[100px]",
          )}
        >
          <AvatarImage src={finalAvatarUrl} alt="User Avatar" />
          <AvatarFallback className="bg-exp-a0 rounded-md" />
        </Avatar>
        {isSettings && (
          <>
            <ExpButton
              onClick={() => setIsMenuOpen(true)}
              className={"bg-exp-a0 text-dark-a3"}
              custom_textbtn
            >
              Change Avatar
            </ExpButton>
          </>
        )}
      </Flexrow>

      {/* MODAL 1: Main menu */}
      <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DialogContent className="bg-dark-a3 border-dark-a4 [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Profile pic</DialogTitle>
          </DialogHeader>
          <Flexcol className="gap-2">
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <div className="flex flex-col gap-2 py-4">
                <Button onClick={open}>Upload New</Button>
                <Button variant="destructive" onClick={handleRemove}>
                  Remove Current
                </Button>
                <Button variant="outline" onClick={() => setIsMenuOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Flexcol>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Image Cropper */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit and Crop Image</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 p-4">
            <div className="relative h-64 w-full">
              {imgSrc && (
                <Cropper
                  image={imgSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  cropShape="rect"
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                />
              )}
            </div>

            {/* Controls */}
            <div className="w-full">
              <label htmlFor="zoom" className="font-para2-m text-sm">
                Zoom
              </label>
              <Slider
                id="zoom"
                min={1}
                max={3}
                step={0.1}
                value={[zoom]}
                onValueChange={(val) => setZoom(val[0])}
              />
            </div>
            <div className="w-full">
              <label htmlFor="rotate" className="font-para2-m text-sm">
                Rotate
              </label>
              <Slider
                id="rotate"
                min={0}
                max={360}
                step={1}
                value={[rotation]}
                onValueChange={(val) => setRotation(val[0])}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserAvatar;
