// const axios = require('axios');
import axios from 'axios';

const apiKey = "7627f68a87bcf1041235d75c5892115d328216e0";

const url = 'https://api-v2.longshot.ai/custom/api/generate/instruct';
// const token = apiKey; // Replace <token> with your actual token

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`
};

export async function sendMsgToHandler(message) {
    const data = {
        "text": message
    };

    try {
        const response = await axios.post(url, data, { headers: headers });
        console.log(response.data);
        return extractContent(response.data);
      } catch (error) {
        console.error('Error:', error);
        return "Check Internet connection, Error: 404";
      }

}

function extractContent(apiResponse) {
    if (apiResponse && Array.isArray(apiResponse.copies) && apiResponse.copies.length > 0) {
        return apiResponse.copies[0].content;
    } else {
        // Handle the case where the structure is not as expected
        console.error("Invalid response structure:", apiResponse);
        return null;
    }
}