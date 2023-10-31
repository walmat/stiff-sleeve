<script>
  import { T, useFrame } from '@threlte/core'
  import { OrbitControls, useGltf } from '@threlte/extras'
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
	
		return -innerHeight / (Math.max(minScale, Math.min(maxScale, innerWidth)) * denominator);
	}
</script>

<svelte:window bind:innerWidth={innerWidth} bind:innerHeight={innerHeight} />

<T.OrthographicCamera position={[0, 0, 10]} zoom={100} makeDefault>
  <OrbitControls enabled={false} enableDamping enableZoom={false} target={[0, 0, 0]} />
</T.OrthographicCamera>

<T.AmbientLight color="#fff" intensity={2.5} />
<T.PointLight intensity={100} position={[4, 2, 4]} color="#fff" />

{#await useGltf('/models/sleeve.glb', { useDraco: true }) then sleeve}
  <T
		tag={product.name}
		is={sleeve.scene}
		position={[0, getYPosition(), 0]}
		scale={[Math.max(minScale, Math.min(maxScale, innerWidth / 100)), Math.max(minScale, Math.min(maxScale, innerWidth / 100)), Math.max(minScale, Math.min(maxScale, innerWidth / 100))]} 
		rotation.y={rotation}
	/>
{/await}