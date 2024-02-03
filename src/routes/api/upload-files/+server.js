import { json } from '@sveltejs/kit';
import pinataSDK from '@pinata/sdk';
import { Readable } from 'stream';
import { pinFileToIPFS } from '$lib/utils/pinata.js';

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const file = formData.get('file'); // this is a Blob
    const name = formData.get('name');

    if (!file || !name) {
      return json({ status: 'error', message: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // EOS

    const ipfsHash = await pinFileToIPFS(stream, name);
    if (ipfsHash) {
      return json({ status: 'success', hash: ipfsHash }, { status: 200 });
    } else {
      return json({ status: 'error', message: 'Failed to upload to IPFS' }, { status: 500 });
    }
  } catch (error) {
    return json({ status: 'error', message: error.message }, { status: 500 });
  }
}
