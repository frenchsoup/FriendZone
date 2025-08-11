const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    const { file, data, action, index, section } = JSON.parse(event.body);
    // Try multiple possible paths
    const possiblePaths = [
      path.join(__dirname, 'data', file), // /var/task/data/keepers_2025.json
      path.join(__dirname, 'friendzoneff', 'data', file), // /var/task/friendzoneff/data/keepers_2025.json
      path.join(__dirname, '..', 'data', file) // /var/data/keepers_2025.json
    ];
    
    let filePath;
    for (const p of possiblePaths) {
      console.log('Checking path:', p);
      if (fs.existsSync(p)) {
        filePath = p;
        break;
      }
    }

    console.log('Selected filePath:', filePath);
    
    // Log directory contents for debugging
    const rootDir = __dirname;
    console.log('Current __dirname:', __dirname);
    console.log('Root directory contents:', fs.readdirSync(rootDir));

    const dataDir = path.join(__dirname, 'data');
    console.log('Data directory path:', dataDir);
    if (fs.existsSync(dataDir)) {
      console.log('Data directory contents:', fs.readdirSync(dataDir));
    } else {
      console.log('Data directory does not exist:', dataDir);
    }

    if (!filePath) {
      console.log('File not found at any path:', possiblePaths);
      return { statusCode: 404, body: JSON.stringify({ error: `File not found: ${file}` }) };
    }

    let fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (action === 'update') {
      console.log('Writing data to:', filePath);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return { statusCode: 200, body: JSON.stringify({ message: 'Data updated successfully' }) };
    } else if (action === 'delete') {
      if (section) {
        fileData[section] = fileData[section].filter((_, i) => i !== index);
      } else {
        fileData = fileData.filter((_, i) => i !== index);
      }
      console.log('Writing data to:', filePath);
      fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
      return { statusCode: 200, body: JSON.stringify({ message: 'Item deleted successfully' }) };
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action' }) };
  } catch (error) {
    console.error('Error in update-data:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
