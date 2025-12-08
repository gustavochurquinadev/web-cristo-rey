import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

// Configuración
const TARGET_DIR = './public/images';
const QUALITY = 80; // Equilibrio perfecto entre calidad y peso

async function getFiles(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = join(dir, subdir);
        return (await stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.flat();
}

async function convertImages() {
    console.log('🎨 Iniciando optimización de imágenes...');
    const files = await getFiles(TARGET_DIR);

    let count = 0;

    for (const file of files) {
        const ext = extname(file).toLowerCase();

        // Solo procesar JPG y PNG
        if (ext === '.webp' || ext === '.jpeg' || ext === '.png') {
            const newFile = file.replace(ext, '.webp');

            try {
                await sharp(file)
                    .webp({ quality: QUALITY })
                    .toFile(newFile);

                console.log(`✅ Convertido: ${basename(file)} -> ${basename(newFile)}`);
                count++;
            } catch (error) {
                console.error(`❌ Error en ${file}:`, error.message);
            }
        }
    }

    console.log(`\n🎉 ¡Listo! ${count} imágenes optimizadas a WebP.`);
    console.log('👉 Ahora actualiza tus imports en el código (Ctrl + Shift + F para buscar/reemplazar).');
}

convertImages();