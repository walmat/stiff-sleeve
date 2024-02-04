<script>
  import Dropzone from "svelte-file-dropzone";
  import { superForm } from "sveltekit-superforms/client"
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  import { invalidateAll } from '$app/navigation';
  import { applyAction, deserialize } from '$app/forms';
  import { doRecaptcha } from '$lib/utils/recaptcha';
  import Footer from "../../components/Footer.svelte";

  export let data;

  let files = [];

  const { form, errors, constraints, delayed, submitting, validate } = superForm(data.form, {
    applyAction: false,
    timeoutMs: 10000,
    delayMs: 1000,    
  })

  function handleRemoveAll() {
    files = [];
  }

  function handleRemoveFile(_, index) {
    files.splice(index, 1);
    files = [...files];
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
      files = [
        ...files,
        ...uploadedFiles.map((file) => ({
          path: file.path,
          ipfsHash: file.ipfsHash
        }))
      ];
    } catch (error) {
        errors.set('files', 'Error uploading files');
    }
  }

  async function onContactSubmit(event) {
    await validate();

    const formData = new FormData(event.target);

    const token = await doRecaptcha();
    formData.append('_t', token);
    formData.append('files', JSON.stringify(files));

    const response = await fetch(event.target.action, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData
    });

    const result = deserialize(await response.text());
    if (result.type === 'success') {
      // Handle success, such as showing a message to the user
      await invalidateAll();
    } else {
      // Handle error, such as displaying the error message to the user
    }

    applyAction(result);
  }
</script>

<div class="h-full w-full">
  <div class="container h-full px-5 py-24 mx-auto">
    <form
      class="group flex flex-col gap-4"
      action="?/contact"
      method="POST"
      on:submit|preventDefault={onContactSubmit}
    >
      <label for="name" class="font-[Aachen] text-neutral-600">Name</label>
      <input
        name="name"
        bind:value={$form.name}
        aria-invalid={$errors.name ? 'true' : undefined}
        {...$constraints.name}
        class="font-[Aachen] placeholder:text-neutral-400 px-2 py-4 w-full rounded-sm focus:placeholder:text-neutral-600 outline-none bg-stone-200 text-left"
        placeholder="John Doe"
      />
      {#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}

      <label for="email" class="font-[Aachen] text-neutral-600">Email Address</label>
      <input
        name="email"
        bind:value={$form.email}
        aria-invalid={$errors.email ? 'true' : undefined}
        {...$constraints.email}
        class="font-[Aachen] placeholder:text-neutral-400 px-2 py-4 w-full rounded-sm focus:placeholder:text-neutral-600 outline-none bg-stone-200 text-left"
        placeholder="johndoe@example.com"
      />
      {#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}

      <label for="orderNumber" class="font-[Aachen] text-neutral-600">Order Number</label>
      <input
        name="orderNumber"
        bind:value={$form.orderNumber}
        class="font-[Aachen] placeholder:text-neutral-400 px-2 py-4 w-full rounded-sm focus:placeholder:text-neutral-600 outline-none bg-stone-200 text-left"
        placeholder="#1234567890"
      />

      <label for="message" class="font-[Aachen] text-neutral-600">Message</label>
      <textarea
        id="message"
        name="message"
        bind:value={$form.message}
        aria-invalid={$errors.message ? 'true' : undefined}
        {...$constraints.message}
        class="font-[Aachen] placeholder:text-neutral-400 px-2 py-4 w-full h-[100px] rounded-sm focus:placeholder:text-neutral-600 outline-none bg-stone-200 text-left"
        placeholder="What can we help you with?"
      />
      {#if $errors.message}<span class="invalid">{$errors.message}</span>{/if}

      <Dropzone maxSize={5242880} on:drop={handleFilesSelect} />

      <div class="mt-4 flex flex-col gap-2">
        {#if files.length > 0}
          <button on:click={handleRemoveAll}>RemoveAll</button>
        {/if}
        {#each files as item, index}
          <div class="flex justify-between w-full">
            <span>{item.path}</span>
            <button on:click={(e) => handleRemoveFile(e, index)}>Remove</button>
          </div>
        {/each}
      </div>

      <button disabled={$submitting || $delayed} type="submit" class="font-[Aachen] hover:bg-black/80 rounded-sm px-4 py-2 bg-black text-white">
        {#if $submitting}
          <span>Submitting...</span>
        {:else if $delayed}
          <span>Still working...</span>
        {:else}
          <span>Submit</span>
        {/if}
      </button>
    </form>
  </div>

  <div class="relative md:absolute md:bottom-0 md:left-0 w-full">
    <Footer />
  </div> 
</div>

<style>
  .invalid {
    color: red;
  }
</style>