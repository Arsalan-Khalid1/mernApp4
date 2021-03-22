const axios = require('axios');
const HttpError = require('../models/http-errors');
const API_Key = require('../Keys/API_KEY');

async function getCoordsForAddress(address) {
    const params = {
        access_key : API_Key,
        query : address
    };
    const response = await axios.get('http://api.positionstack.com/v1/forward',{params});
    const data = response.data;
    if(!data)
    {
        const error = new HttpError("Could not find the location for specifie address", 422);
        throw error;
    }
    const coordinates = {
        lat : data.data[0].latitude,
        lng : data.data[0].longitude
    }
    console.log(coordinates)
    return coordinates;
}


module.exports = getCoordsForAddress;