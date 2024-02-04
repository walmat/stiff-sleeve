<script>
  import Icons from '$components/Icons.svelte';
  import { createEventDispatcher } from 'svelte';
  import { LockIcon } from 'lucide-svelte'
  const dispatch = createEventDispatcher();
  export let loading = false;
  export let items = [];

  function addOneItem(item, i) {
    loading = true;
    dispatch('addProduct', {
      body: item.node.merchandise.id
    });
  }

  function removeOneItem(item, i) {
    loading = true;
    let quantity = item.node.quantity - 1;
    dispatch('removeProduct', {
      body: {
        variantId: item.node.merchandise.id,
        quantity: quantity,
        lineId: item.node.id
      }
    });
  }

  async function checkout() {
    loading = true;
    let checkoutUrl = localStorage.getItem('cartUrl');
    window.open(JSON.parse(checkoutUrl), '_self');
    loading = false;
  }
</script>

<div
  class="absolute inset-0 z-50 flex max-h-screen w-full justify-end overflow-hidden bg-black/50"
>
  <div class="z-51 w-full bg-[#FAF9F6] pt-5 pb-5 pr-8 pl-4 md:w-1/2 lg:w-1/3 relative">
    {#if loading}
      <div class="absolute inset-0 bg-black/50 z-51" />
    {/if}
    <div class="mb-6 flex w-full items-center justify-between">
      <h1 class="font-[Aachen] text-lg">Shopping cart</h1>
      <button on:click class="text-sm uppercase opacity-80 hover:opacity-100">
        <Icons strokeColor="#000" type="close" />
      </button>
    </div>
    {#if items.length === 0}
      <div class="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-black">
          <Icons type="cart" strokeColor="#fff" />
        </div>
        <div class="mt-6 text-center text-2xl font-bold">Your cart is empty.</div>
      </div>
    {/if}
    <div class="overflow-y-auto" style="height: 80%;">
      {#each items as item, i (i)}
        <div class="mb-2 flex w-full">
          <img
            alt={item.node.merchandise.product.title}
            decoding="async"
            loading="lazy"
            class="w-20 flex-none rounded-md bg-stone-300"
            src={item.node.merchandise.product.images.edges[0].node.originalSrc}
          />
          <div class="ml-4 flex w-full flex-col justify-between">
            <div class="flex w-full flex-col justify-start">
              <p class="text-lg font-semibold">{item.node.merchandise.product.title}</p>
              <p class="text-sm font-normal">{item.node.merchandise.title}</p>
            </div>

            <div class="flex w-full items-center justify-between">
              <div class="flex gap-4 items-center">
                <button
                  on:click={() => {
                    removeOneItem(item, i);
                  }}
                  class="ml-auto flex h-4 w-4 items-center justify-center rounded-sm border-black/40 bg-white/0 hover:bg-white/10"
                >
                  <Icons type="minus" strokeColor="#000" />
                </button>
                <p>{item.node.quantity}</p>
                <button
                  on:click={() => {
                    addOneItem(item, i);
                  }}
                  class="flex h-4 w-4 items-center justify-center rounded-sm border-black/40 bg-white/0 hover:bg-white/10"
                >
                  <Icons type="plus" strokeColor="#000" />
                </button>
              </div>
              <p class="font-medium">${item.node.estimatedCost.totalAmount.amount}</p>

            </div>

          </div>
        </div>
        
      {/each}
    </div>
    {#if items.length !== 0}
      <button
        on:click={checkout}
        class="mt-6 flex w-full gap-4 items-center justify-center bg-black p-3 py-4 text-sm font-medium uppercase text-white rounded-md opacity-90 hover:opacity-100"
      >
        <span>Proceed to Checkout</span>
        {#if !loading}
          <LockIcon class="w-4 h-4 text-white" />
        {/if}
        {#if loading}
          <div class="lds-ring ml-4">
            <div />
            <div />
            <div />
            <div />
          </div>
        {/if}
      </button>
    {/if}
  </div>
</div>

<style>
  .lds-ring {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 20px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    margin: 2px;
    border: 2px solid #000;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #000 transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  h1 {
    font-family: 'Aachen';
    font-size: 1.25rem;
  }
</style>


