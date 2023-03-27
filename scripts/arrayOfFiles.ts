import fs from 'fs/promises';
import path from 'path';

export const getCsvFiles = async () => {
    const directoryPath = path.join(__dirname, 'files');

    try {
        const files = await fs.readdir(directoryPath);
        const csvFiles = files.filter(file => path.extname(file) === '.csv');

        return csvFiles;
    } catch (err) {
        console.error(err);
    }
}

