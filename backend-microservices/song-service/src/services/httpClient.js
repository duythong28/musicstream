// song-service/src/services/httpClient.js
import axios from "axios";

const services = {
  user: process.env.USER_SERVICE_URL || "http://localhost:3001",
  album: process.env.ALBUM_SERVICE_URL || "http://localhost:3003",
};

export const callService = async (
  serviceName,
  path,
  method = "GET",
  data = null,
  headers = {}
) => {
  try {
    const url = `${services[serviceName]}${path}`;
    const response = await axios({
      method,
      url,
      data,
      headers,
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error(`Error calling ${serviceName} service:`, error.message);
    throw new Error(`Failed to call ${serviceName} service`);
  }
};
