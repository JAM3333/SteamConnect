import axios from 'axios';
import tunnel from 'tunnel-ssh';
import fs from 'fs';

async function makeRequest() {
  // SSH tunnel configuration
      const config = {
        username: 'jump-bwi-2026',
        //privateKey: fs.readFileSync('D:/GitHub/id_bwi_2026'),
        passphrase: 'uLovLNX24!',
        host: 'itlabor3.htldornbirn.vol.at',
        port: 11205, // Default SSH port
        dstHost: '10.115.2.40', // Destination host
        dstPort: 3004, // Destination port
        localHost: '127.0.0.1', // Local host
        localPort: 3004, // Local port
        keepAlive: true,
      };

  // Create SSH tunnel
  const [server,client] = await tunnel.createTunnel(config, async (error, server) => {
    if (error) {
      console.error('Error creating SSH tunnel:', error);
      return;
    }

    console.log('SSH tunnel connected successfully');

    try {
      // Make GET request using Axios
      const response = await axios.get('http://localhost:3004/api/endpoint');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error making GET request:', error);
    }

    // Close SSH tunnel after request
    server.close();
  })
}














/*

import axios from 'axios';
import { Client } from 'ssh2-client';

const createSshTunnel = () => {
  return new Promise((resolve, reject) => {
    const sshConfig = {
        host: 'itlabor3.htldornbirn.vol.at',
        port: 11205,
        username: 'jump-bwi-2026',
        privateKey: require('fs').readFileSync('D:\GitHub\id_bwi_2026'),
        passphrase: 'uLovLNX24!'
    };

    const forwardConfig = {
      srcHost: '127.0.0.1',
      srcPort: 3004,
      dstHost: '10.115.2.40',
      dstPort: 3004
    };

    const conn = new Client();
    conn.on('ready', () => {
      conn.forwardOut(
        forwardConfig.srcHost,
        forwardConfig.srcPort,
        forwardConfig.dstHost,
        forwardConfig.dstPort,
        (err, stream) => {
          if (err) {
            reject(err);
          } else {
            resolve(stream);
          }
        }
      );
    }).connect(sshConfig);
  });
};

const ApiClient = async () => {
  try {
    // Create SSH tunnel
    const tunnelStream = await createSshTunnel();

    // Use Axios with tunnel
    const response = await axios.get('http://127.0.0.1:3004/api/endpoint', {
      httpAgent: tunnelStream
    });

    // Handle response
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

export default ApiClient; */
