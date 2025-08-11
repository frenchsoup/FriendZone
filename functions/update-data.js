const fs = require('fs').promises;
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const { file, data, action, index, section } = JSON.parse(event.body);
    const filePath = path.join(__dirname, '..', 'data', file);

    if (action === 'update') {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data updated successfully' })
      };
    } else if (action === 'delete') {
      let currentData;
      try {
        currentData = JSON.parse(await fs.readFile(filePath));
      } catch (err) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'File not found' })
        };
      }

      if (file.startsWith('keepers_') || file === 'payouts.json') {
        if (typeof index !== 'number') {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid index for delete action' })
          };
        }
        currentData.splice(index, 1);
        await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Item deleted successfully' })
        };
      } else if (file === 'rules.json') {
        if (typeof index === 'number') {
          currentData.sections.splice(index, 1);
        } else if (index && typeof index.sectionIndex === 'number' && typeof index.itemIndex === 'number') {
          currentData.sections[index.sectionIndex].items.splice(index.itemIndex, 1);
        } else {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid index for rules delete action' })
          };
        }
        await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Item deleted successfully' })
        };
      } else if (file.startsWith('prizes_')) {
        if (typeof index !== 'number' || !section || !['weeklyHighScores', 'survivor'].includes(section)) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid delete action: missing or invalid section or index' })
          };
        }
        currentData[section].splice(index, 1);
        await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Item deleted successfully' })
        };
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid delete action' })
        };
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid action' })
      };
    }
  } catch (error) {
    console.error('Error in update-data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};