import multer from 'multer';

// Use memory storage to process files as buffers, which is perfect for Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15 MB limit per file
    },
});

// This middleware will look for a field named 'image' and a field named 'audio'
export const uploadSongFiles = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
]);