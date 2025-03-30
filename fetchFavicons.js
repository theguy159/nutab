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
const links = config.categories.flatMap(category =>
  category.links.filter(link => !link.hasOwnProperty('icon')).map(link => link.href)
);

// Output directory for favicons
const outputDir = path.join(__dirname, 'public/favicons');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const metadataPath = path.join(outputDir, 'favicons.json');
let faviconMetadata = {};

// Load existing metadata if available
if (fs.existsSync(metadataPath)) {
  faviconMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
}

(async () => {
  for (const link of links) {
    try {
      const faviconUrl = await faviconFetch({ uri: link });
      if (faviconUrl) {
        const response = await axios.get(faviconUrl, { responseType: 'arraybuffer' });
        const contentType = response.headers['content-type'];
        let ext = '.ico'; // Default extension

        if (contentType.includes('png')) ext = '.png';
        else if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = '.jpg';
        else if (contentType.includes('svg')) ext = '.svg';
        else if (contentType.includes('gif')) ext = '.gif';
        else if (contentType.includes('webp')) ext = '.webp';

        const hostname = new URL(link).hostname.replace(/\./g, '_');
        const faviconName = `${hostname}${ext}`;
        const filePath = path.join(outputDir, faviconName);

        fs.writeFileSync(filePath, response.data);
        console.log(`Saved favicon for ${link} as ${faviconName}`);

        // Store the correct extension in metadata
        faviconMetadata[hostname] = faviconName;
      } else {
        console.warn(`No favicon found for ${link}`);
      }
    } catch (error) {
      console.error(`Failed to fetch favicon for ${link}:`, error.message);
    }
  }

  // Save metadata to JSON
  fs.writeFileSync(metadataPath, JSON.stringify(faviconMetadata, null, 2));
})();
