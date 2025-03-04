import path from "node:path";
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve('./src/config/.env') });

import {v2 as cloudinary} from 'cloudinary';
    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET 
    });

    export default cloudinary