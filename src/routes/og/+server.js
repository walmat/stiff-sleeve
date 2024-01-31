// src/routes/og/+server.ts
import { ImageResponse } from '@ethercorps/sveltekit-og';

const template = `
  <div tw="bg-[#FAF9F6] flex w-full h-full items-center justify-center">
    <div tw="flex flex-row w-full h-full">
      <div tw="w-1/2">
        <img src="https://stiffsleeve.com/sleeve.png" alt="Image description" tw="w-full h-full object-cover">
      </div>
      <div tw="w-1/2 flex flex-col justify-center items-start p-8">
        <h2 tw="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
          <span>Ready to dive in?</span>
          <span tw="text-indigo-600">Start your free trial today.</span>
        </h2>
        <div tw="mt-8 flex">
          <div tw="flex rounded-md shadow">
            <a href="#" tw="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white">Get started</a>
          </div>
          <div tw="ml-3 flex rounded-md shadow">
            <a href="#" tw="flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600">Learn more</a>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

const fontFile = await fetch('https://stiffsleeve.com/fonts/AachenRegular.ttf');
const fontData = await fontFile.arrayBuffer();

export const GET = async () => {
  return await new ImageResponse(template, {
    height: 630,
    width: 1200,
    fonts: [
      {
        name: 'Aachen',
        data: fontData,
        weight: 400
      }
    ]
  });
};