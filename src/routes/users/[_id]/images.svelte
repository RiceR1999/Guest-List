<script context="module">
	export const load = ({ params }) => {
		const id = params._id;
		console.log(params._id);
		return {
			props: {
				id
			}
		};
	};
</script>

<script>
	import SideBar from '../../../components/SideBar.svelte';
	import NavBar from '../../../components/NavBar.svelte';
	import { onMount } from 'svelte';
	import { tokenStore } from '../../../stores/userStore';
	import axios from 'axios';
	export let id;
	let open = false;
	let user = { userName: '', password: '', _id: '', avatarId: '', pdfId: '', files: [] };

	onMount(async () => {
		const res = await axios.get(`http://localhost:4000/api/user/${id}`, {
			headers: { Authorization: `Bearer ${$tokenStore}` }
		});
		user = res.data;
		console.log(user);
	});
</script>

<div class="text-center border-orange-300 card bg-gray-50">
	<div>
		<SideBar bind:open {id} />
		<NavBar bind:sidebar={open} />
		<h2 class="pb-4 pt-3 border-b-2 border-orange-300 mb-3">{id}</h2>
	</div>
	<h1 class="pb-3">Image Gallery</h1>
	<h1 class="pb-3">{user.userName}</h1>
	<div id="app">
		{#if user.files}
			<div class="container">
				<div class="columns-2">
					{#each user.files as file}
						<div class="avatar">
							<img src="http://localhost:4000/api/image/{file}" alt="image" class="image" />
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.avatar {
		max-width: 200px;
		max-height: 200px;
		border-radius: 10px;
		margin-left: 75px;
		margin-top: 5px;
		margin-bottom: 10px;
		border: 2px solid orange;
		padding: 20px;
	}
	.image {
		max-width: 150px;
		max-height: 150px;
	}
</style>
