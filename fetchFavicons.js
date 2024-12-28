import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import faviconFetch from 'favicon-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read config.json
const configPath = path.join(__dirname, 'assets/config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Extract all href links from categories
const links = config.categories.flatMap(category => category.links.filter(link => !link.hasOwnProperty('icon')).map(link => link.href));

// Output directory for favicons
const outputDir = path.join(__dirname, 'public/favicons');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
  for (const link of links) {
    try {
      const faviconUrl = faviconFetch({uri: link });
      if (faviconUrl) {
        const response = await axios.get(faviconUrl, { responseType: 'arraybuffer' });
        const faviconName = `${new URL(link).hostname.replace(/\./g, '_')}.ico`;
        const filePath = path.join(outputDir, faviconName);

        fs.writeFileSync(filePath, response.data);
        console.log(`Saved favicon for ${link} as ${faviconName}`);
      } else {
        console.warn(`No favicon found for ${link}`);
      }
    } catch (error) {
      console.error(`Failed to fetch favicon for ${link}:`, error.message);
    }
  }
})();
