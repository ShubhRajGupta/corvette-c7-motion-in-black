import obj2gltf from 'obj2gltf';
import fs from 'fs';
import path from 'path';

const inputPath = path.resolve('models/Corvette_C7_OBJ/Corvette_PBR.obj');
const outputPath = path.resolve('public/models/corvette_c7.glb');

console.log('Starting conversion of Corvette C7 OBJ to GLB...');
console.log('Input:', inputPath);
console.log('Output:', outputPath);

const options = {
  binary: true,
  inputUpAxis: 'Z',
  outputUpAxis: 'Y',
  checkTransparency: false,
  doubleSidedMaterial: false,
};

const startTime = Date.now();

obj2gltf(inputPath, options)
  .then((glbBuffer) => {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, glbBuffer);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const sizeMb = (glbBuffer.length / (1024 * 1024)).toFixed(2);
    console.log(`Success! GLB saved in ${elapsed}s. Size: ${sizeMb} MB`);
  })
  .catch((err) => {
    console.error('Error during conversion:', err);
    process.exit(1);
  });
