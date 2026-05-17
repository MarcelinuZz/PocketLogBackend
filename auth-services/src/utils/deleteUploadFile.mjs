import fs from 'fs';

const deleteUploadedFile = (req) => {
    if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
            if (err && err.code !== 'ENOENT') {
                console.error('[Upload Cleanup] Gagal hapus file:', err);
            }
        });
    }
};

export default deleteUploadedFile;