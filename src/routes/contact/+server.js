import { json } from '@sveltejs/kit';
import pinataSDK from '@pinata/sdk';

const pinata = new pinataSDK(
  import.meta.env.VITE_PINATA_API_KEY,
  import.meta.env.VITE_PINATA_SECRET_API_KEY
);

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const name = formData.get('name');
    const type = formData.get('type');

    const blob = new Blob([file], { type: 'application/octet-stream' });

    const res = await pinata.pinFileToIPFS(blob.stream(), {
      pinataMetadata: {
        name,
        keyvalues: {
          type,
        },
      },
    });
    if (res.IpfsHash) {
      return json({ status: 'success', hash: res.IpfsHash }, { status: 200 });
    } else {
      return json({ status: 'error', message: 'Failed to upload to IPFS' }, { status: 500 });
    }
  } catch (error) {
    console.log(error);
    return json({ status: 'error', message: error.message }, { status: 500 });
  }
}
