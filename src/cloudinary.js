var cloudinary = require('cloudinary').v2

cloudinary.config({ 
  cloud_name: 'dtceo0fjk', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = cloudinary;