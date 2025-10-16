import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware for a single file on the 'image' field
export const uploadAlbumImage = upload.single('image');