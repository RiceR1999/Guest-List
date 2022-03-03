<script>
	import Nav from '../components/Nav.svelte';
	import Footer from '../components/Footer.svelte';
	let user = 'Test2';
	function handleSignin(e) {
		console.log(e);
		user = e.detail;
	}
</script>

<Nav on:signin={handleSignin} bind:value={user} {user} />
<div class="p-8 max-w-6xl mx-auto">
	<slot />
</div>
<Footer />

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
