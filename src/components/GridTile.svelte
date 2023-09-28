<script>
  export let title = '';
  export let removeLabels = false;
  export let imageSrc;
  export let price = '';
  export let currencyCode = '';
  export let href = '';
  export let priority = 'lazy';

  let hover = false;
</script>

<div
  on:mouseenter={() => {
    hover = true;
  }}
  on:mouseleave={() => {
    hover = false;
  }}
  class="flex flex-col justify-center items-center w-full overflow-hidden"
>
  <a
    data-test="grid-tile"
    {href}
    data-sveltekit-prefetch
    class="focus:border-blue-500 focus:border-2 relative flex flex-col h-1/2 w-full items-center justify-center"
  >
    <img
      alt={title}
      class={`w-full flex-none transition duration-300 ease-in-out ${
        hover ? 'scale-105' : ''
      }`}
      fetchpriority={priority === 'eager' ? 'high' : 'low'}
      decoding="async"
      loading={priority}
      src={imageSrc}
    />
    {#if !removeLabels}
      <div class="flex flex-col items-start">
        <div class="bg-black px-3 text-2xl font-medium">
          {title}
        </div>
        <div class="w-fit bg-black px-3 text-sm">
          ${price}
          {currencyCode}
        </div>
      </div>
    {/if}
  </a>
</div>
