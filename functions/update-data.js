const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    const { file, data, action, index, section } = JSON.parse(event.body);
    // Use data/ in the same directory as the function
    const filePath = path.join(__dirname, 'data', file);
    console.log('Attempting to access file:', filePath);
    
    // Log directory contents for debugging
    const rootDir = __dirname; // /var/task
    console.log('Current __dirname:', __dirname);
    console.log('Root directory contents:', fs.readdirSync(rootDir));

    const dataDir = path.join(__dirname, 'data');
    console.log('Data directory path:', dataDir);
    if (fs.existsSync(dataDir)) {
      console.log('Data directory contents:', fs.readdirSync(dataDir));
    } else {
      console.log('Data directory does not exist:', dataDir);
    }

    if (!fs.existsSync(filePath)) {
      console.log('File not found at:', filePath);
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