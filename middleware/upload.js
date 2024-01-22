import multer from 'multer';

// Set up storage for multer (this can be customized as per your requirements)
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
    }
});

export const upload = multer({ storage: storage });
