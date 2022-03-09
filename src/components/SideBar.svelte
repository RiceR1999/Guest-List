<script>
	import { fade } from 'svelte/transition';
	export let open = false;
	export let id;
</script>

<aside class="absolute w-full h-full bg-gray-200 border-r-2 border-orange-300 shadow-lg" class:open>
	<nav class=" flexp-12 text-s pt-9" in:fade>
		<a class="block border-b-2 border-orange-300 w-50 mb-2" href="/users/{id}/pdf">PDF</a>
		<a class="block border-b-2 border-orange-300 w-50" href="/users/{id}">Image</a>
	</nav>
</aside>

<style>
	aside {
		display: none;
	}
	a:hover {
		color: orange;
	}

	.open {
		left: 0;
		display: block;
		/*Handle transition in*/
		/* transition: 2s ease-in; */
		width: 25%;
	}
</style>
