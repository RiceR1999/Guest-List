<script>
	import Hamburger from './Hamburger.svelte';
	import Logo from './Logo.svelte';

	export let sidebar = false;
</script>

<header class="flex justify-between bg-gray-200 p-2 items-center text-gray-600 border-b-2">
	<nav class="flex">
		<Hamburger bind:open={sidebar} />
		<Logo />
	</nav>
</header>

<style>
</style>
