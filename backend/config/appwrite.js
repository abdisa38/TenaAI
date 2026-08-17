const { Client, Storage, Databases } = require('appwrite');

const client = new Client();

if (process.env.APPWRITE_ENDPOINT && process.env.APPWRITE_PROJECT_ID) {
  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);
    
  if (process.env.APPWRITE_API_KEY) {
    client.setKey(process.env.APPWRITE_API_KEY);
  }
}

const storage = new Storage(client);
const databases = new Databases(client);

module.exports = {
  client,
  storage,
  databases,
  bucketId: process.env.APPWRITE_STORAGE_BUCKET_ID || 'medtriage_media'
};
