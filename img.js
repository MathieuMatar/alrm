import fs from 'fs';
import path from 'path';

function generateAlt(name) {
  return "Alyassa " + name.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '').replace(/\b\w/g, c => c.toUpperCase());
}

function buildTree(currentPath = "C:\\Users\\mathi\\Desktop\\Alyassa\\resources\\img", relativePath = "img") {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });
  const result = {};

  entries.forEach(entry => {
    const fullPath = path.join(currentPath, entry.name);
    const relative = path.join(relativePath, entry.name).replace(/\\/g, '\\');
    const nameWithoutExt = path.parse(entry.name).name;

    if (entry.isDirectory()) {
      result[entry.name] = buildTree(fullPath, path.join(relativePath, entry.name));
    } else {
      const ext = path.extname(entry.name).slice(1);
      const alt = generateAlt(nameWithoutExt);
      result[nameWithoutExt] = {
        path: relative,
        alt: alt,
        ext: ext,
        img: ` src=${relative} alt=${alt} `
      };
    }
  });

  return result;
}

export { buildTree };
