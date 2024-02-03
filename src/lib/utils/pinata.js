import pinataSDK from '@pinata/sdk';

const pinata = new pinataSDK(import.meta.env.PINATA_API_KEY, import.meta.env.PINATA_SECRET_API_KEY);

export async function isAuthenticated() {
  const res = await pinata.testAuthentication();
  return res.authenticated;
}

export async function pinFileToIPFS(stream, name) {
  if (!stream || !name) {
    throw new Error('No file provided');
  }

  if (!isAuthenticated()) {
    throw new Error('Not authenticated');
  }

  const res = await pinata.pinFileToIPFS(stream, {
    pinataMetadata: {
      name,
    },
  });

  if (res.IpfsHash) {
    return res.IpfsHash;
  } else {
    throw new Error('Failed to upload to IPFS');
  }
}