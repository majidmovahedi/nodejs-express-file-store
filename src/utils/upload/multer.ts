import multer from "multer";
import path from "path";

// Set up Multer storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the folder to store uploaded files
    },
    filename: (req, file, cb) => {
      // Use the original name or create a unique name
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  // Initialize Multer with the storage configuration
  const upload = multer({ storage: storage });

  export default upload;
