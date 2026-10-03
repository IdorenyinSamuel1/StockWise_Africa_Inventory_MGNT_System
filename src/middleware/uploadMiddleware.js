import multer from "multer";

// Configure fast RAM memory storage instead of disk storage
const storage = multer.memoryStorage();

//  Filter incoming files to ensure they are ONLY valid images or videos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format! Please upload an image or a video file."), false);
  }
};

// Initialize Multer instance with file restrictions
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  // Sets a strict maximum limit of 100MB to support product video streams
  limits: {
    fileSize: 100 * 1024 * 1024, 
  },
});
