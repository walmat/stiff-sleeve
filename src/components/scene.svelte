<script>
  import { T, useFrame } from '@threlte/core'
  import { useGltf } from '@threlte/extras'
  import { page } from '$app/stores';

  let rotation = 0

  useFrame((_, delta) => {
    rotation += delta * 0.4
  })

  export let product;

	let innerWidth;
	let innerHeight;

	let minScale = 6.8; // Set your minimum scale value here
	let maxScale = 10; // Set your maximum scale value here
	
  $: isHomepage = $page.route.id === '/';

	function getYPosition() {
		let denominator;
		if (innerWidth < 480) {
			if (isHomepage) {
				denominator = 45;
			} else {
				denominator = 40;
			}
		} else if (innerWidth < 784 && isHomepage) {
			denominator = 75;
		} else {
			denominator = 45;
		}
	
		return -Math.max(innerHeight, 875) / (Math.max(minScale, Math.min(maxScale, innerWidth)) * denominator);
	}
</script>

<svelte:window bind:innerWidth={innerWidth} bind:innerHeight={innerHeight} />

<T.OrthographicCamera position={[0, 0, 10]} zoom={100} makeDefault />

<T.AmbientLight color="#fff" intensity={2.5} />
<T.PointLight intensity={100} position={[4, 2, 4]} color="#fff" />

{#await useGltf(`/models/${product.handle}.glb`, { useDraco: true }) then model}
  <T
		tag={product.name}
		is={model.scene}
		position={[0, getYPosition(), 0]}
		scale={[Math.max(minScale, Math.min(maxScale, innerWidth / 100)), Math.max(minScale, Math.min(maxScale, innerWidth / 100)), Math.max(minScale, Math.min(maxScale, innerWidth / 100))]} 
		rotation.y={rotation}
	/>
{/await}