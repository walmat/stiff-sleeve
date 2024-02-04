<script>
  import { Instagram } from 'lucide-svelte';
</script>
<div class="grid grid-cols-2 justify-between w-full px-4 py-3 md:px-6 md:py-4">
  <a rel="noreferrer" class="flex items-end text-sm text-black font-bold" target="_blank" href="https://www.instagram.com/stiffsleeve/">
    <Instagram />
  </a>
  <div class="flex flex-col gap-2 justify-between items-end">
    <a class="text-sm text-neutral-600 font-bold" href="/contact">
      > Contact
    </a>
    <a class="text-sm text-neutral-600 font-bold" href="/return-policy">
      > Return Policy
    </a>
    <p class="text-sm text-neutral-600 font-bold">
      © {new Date().getFullYear()} Stiff Sleeve Co.
    </p>
  </div>
</div>

<style>
  div {
    font-family: 'Aachen';
  }
</style>