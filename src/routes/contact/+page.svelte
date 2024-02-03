<script>
  import Dropzone from "svelte-file-dropzone";

  import { invalidateAll } from '$app/navigation';
  import { applyAction, deserialize } from '$app/forms';
  import { doRecaptcha } from '$lib/utils/recaptcha';

  export let form;

  let loading;

  let files = {
    accepted: [],
    rejected: []
  };

  function handleRemoveAll() {
    files.accepted = [];
  }

  function handleRemoveFile(e, index) {
    files.accepted.splice(index, 1);
    files.accepted = [...files.accepted];
  }

  async function handleFilesSelect(e) {
    const { acceptedFiles } = e.detail;

    const uploadPromises = acceptedFiles.map(file => {
      return new Promise(async (resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const formData = new FormData();
          formData.append("file", new Blob([reader.result], { type: file.type }));
          formData.append("name", file.path);

          try {
            const response = await fetch('/api/upload-files', {
              method: 'POST',
              body: formData
            });
            if (!response.ok) throw new Error('Failed to upload file');
            const { status, hash } = await response.json();
            if (status === 'success') {
              resolve({ ...file, ipfsHash: hash });
            } else {
              reject(new Error('File upload failed'));
            }
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('File reading failed'));
        reader.readAsArrayBuffer(file);
      });
    });

    try {
        const uploadedFiles = await Promise.all(uploadPromises);
        files.accepted = [...files.accepted, ...uploadedFiles];
    } catch (error) {
        console.error('Error uploading files:', error);
        // Handle errors, e.g., by setting an error state or showing a notification
    }
  }

  async function onContactSubmit(event) {
    const token = await doRecaptcha();
    const data = new FormData(event.target);
    data.append('_t', token);
    data.append('files', JSON.stringify(files.accepted));

    const response = await fetch(event.target.action, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: data
    });

    const result = deserialize(await response.text());
    form = result.data;
    if (result.type === 'success') {
      // Handle success, such as showing a message to the user
      await invalidateAll();
    } else {
      // Handle error, such as displaying the error message to the user
    }

    applyAction(result);
  }
</script>

<div class="container max-w-[40rem]">
  <form
    class="group flex flex-col gap-4 mt-36"
    action="?/contact"
    method="POST"
    on:submit|preventDefault={onContactSubmit}
  >
    <label for="name" class="font-[Aachen] text-neutral-600">Name</label>
    <input
      id="name"
      name="name"
      require
      class="font-[Aachen] placeholder:text-neutral-400 px-2 py-4 w-full rounded-sm focus:placeholder:text-neutral-600 outline-none bg-stone-200 text-left"
      placeholder="John Doe"
    />
    <label for="email" class="font-[Aachen] text-neutral-600">Email Address</label>
    <input
      id="email"
      name="email"
      class="font-[Aachen] placeholder:text-neutral-400 px-2 py-4 w-full rounded-sm focus:placeholder:text-neutral-600 outline-none bg-stone-200 text-left"
      placeholder="johndoe@example.com"
    />
    <label for="order" class="font-[Aachen] text-neutral-600">Order Number</label>
    <input
      id="order"
      name="order"
      class="font-[Aachen] placeholder:text-neutral-400 px-2 py-4 w-full rounded-sm focus:placeholder:text-neutral-600 outline-none bg-stone-200 text-left"
      placeholder="#1234567890"
    />
    <label for="message" class="font-[Aachen] text-neutral-600">Message</label>
    <textarea
      id="message"
      name="message"
      class="font-[Aachen] placeholder:text-neutral-400 px-2 py-4 w-full h-[100px] rounded-sm focus:placeholder:text-neutral-600 outline-none bg-stone-200 text-left"
      placeholder="What can we help you with?"
    />

    <Dropzone on:drop={handleFilesSelect} />

    <div class="mt-4 flex flex-col gap-2">
      {#if files.accepted.length > 0}
        <button on:click={handleRemoveAll}>RemoveAll</button>
      {/if}
      {#each files.accepted as item, index}
        <div class="flex justify-between w-full">
          <span>{item.path}</span>
          <button on:click={(e) => handleRemoveFile(e, index)}>Remove</button>
        </div>
      {/each}
    </div>

    <button disabled={loading} type="submit" class="font-[Aachen] hover:bg-black/80 rounded-sm px-4 py-2 bg-black text-white">
      Submit
    </button>
  </form>
</div>