<script>
	import { T, useFrame } from '@threlte/core'
	import { OrbitControls, useGltf } from '@threlte/extras'

	let rotation = 0

	useFrame((_, delta) => {
		rotation += delta * 0.4
	})

	export let product;
	export let position = [0, 0, 0]; // Changed position to always be centered

	let screenSize;
</script>

<svelte:window bind:innerWidth={screenSize} />

<T.OrthographicCamera position={[0, 2, 10]} zoom={100} makeDefault>
	<OrbitControls enabled={false} enableDamping enableZoom={false} target={[0, screenSize < 400 ? 1 : 2, 0]} /> // Changed target to always be centered
</T.OrthographicCamera>

<T.AmbientLight color="#fff" intensity={2.5} />
<T.PointLight intensity={100} position={[4, 2, 4]} color="#fff" />

{#await useGltf('/models/sleeve.glb', { useDraco: true }) then sleeve}
	<T tag={product.name} is={sleeve.scene} position={position} scale={screenSize < 400 ? 4 : 7.5} rotation.y={rotation}/>
{/await}


