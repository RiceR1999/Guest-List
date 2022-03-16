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

	function printImg(url) {
		var win = window.open('');
		win.document.write('<img src="' + url + '" onload="window.print();window.close()"/>');
		win.focus();
	}

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
				<div class=" grid grid-cols-1 gap-4 sm:grid-cols-2">
					{#each user.files as file}
						<div
							class="avatar"
							on:click={() => {
								printImg(`http://localhost:4000/api/image/${file}`);
							}}
						>
							<div class="flex">
								<img src="http://localhost:4000/api/image/{file}" alt="image" class="image" />
								<div class="pl-5">Click to print</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.avatar:hover {
		cursor: pointer;
		background-color: rgba(211, 211, 211, 0.555);
	}
	.avatar {
		border: 2px solid orange;
		max-width: 200px;
		max-height: 200px;
		border-radius: 10px;
		margin-left: 10vh;
		margin-top: 5px;
		margin-bottom: 10px;
		padding: 20px;
		width: 20vh;
		height: 10vh;
	}

	.image {
		align-items: center;
		max-width: 150px;
		max-height: 150px;
		width: 5vh;
		height: 5vh;
	}
</style>
