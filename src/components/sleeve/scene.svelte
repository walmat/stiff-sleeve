<script>
	import { T, useFrame } from '@threlte/core'
	import { OrbitControls, useGltf } from '@threlte/extras'

	let rotation = 0

	useFrame((_, delta) => {
		rotation += delta * 0.4
	})

	export let product;
	export let scale = 7.5;
	let screenSize;

</script>

<svelte:window bind:innerWidth={screenSize} />

<T.OrthographicCamera position={[0, 2, 10]} zoom={100} makeDefault>
	<OrbitControls enableDamping enableZoom={false} target={[0, screenSize < 640 ? 1 : 2, 0]} />
</T.OrthographicCamera>

<T.AmbientLight color="#fff" intensity={2.5} />
<T.PointLight intensity={100} position={[4, 2, 4]} color="#fff" />

{#await useGltf('/models/sleeve.glb') then sleeve}
	<T tag={product.name} is={sleeve.scene} position={[0, screenSize < 640 ? -1 : 0, 0]} scale={scale} rotation.y={rotation}/>
{/await}

