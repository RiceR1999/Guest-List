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
	import { onMount, afterUpdate } from 'svelte';
	import axios from 'axios';
	import SideBar from '../../components/SideBar.svelte';
	import NavBar from '../../components/NavBar.svelte';
	import { tokenStore } from '../../stores/userStore';

	export let id;
	let image;
	let user = { userName: '', password: '', _id: '', avatarId: '' };
	let dataArray;
	let fileinput;
	let avatar;
	let open = false;
	let uploaded = false;

	onMount(async () => {
		const res = await axios.get(`http://localhost:4000/api/user/${id}`, {
			headers: { Authorization: `Bearer ${$tokenStore}` }
		});
		user = res.data;
	});

	const onFileSelected = (e) => {
		dataArray = new FormData();
		image = e.target.files[0];
		dataArray.append('file', image);

		console.log(dataArray);
		console.log(e.target.files[0]);

		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			avatar = e.target.result;
			uploaded = true;
		};
	};

	const onSubmit = (e) => {
		console.log(dataArray);
		console.log(image);
		axios.post(`http://localhost:4000/api/user/${id}`, dataArray, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${$tokenStore}`
			}
		});
	};
</script>

<div class="text-center border-orange-300 card bg-gray-50">
	<div>
		<SideBar bind:open {id} />
		<NavBar bind:sidebar={open} />
		<h2 class="pb-4 pt-3 border-b-2 border-orange-300 mb-3">{user._id}</h2>
	</div>
	<h1 class="pb-3">{user.userName}</h1>
	<div id="app">
		<h1>Upload Image</h1>
		{#if uploaded === true}
			<img class="avatar" src={avatar} alt="avatar" />
		{:else if user.avatarId}
			<img class="avatar" src="http://localhost:4000/api/image/{user.avatarId}" alt="avatar" />
		{:else}
			<img
				class="avatar"
				src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"
				alt=""
			/>
		{/if}

		<img
			class="upload"
			src="https://static.thenounproject.com/png/625182-200.png"
			alt=""
			on:click={() => {
				fileinput.click();
			}}
		/>
		<div class="flex flex-row justify-center">
			<button
				class="btn btn-secondary mb-3"
				on:click={() => {
					fileinput.click();
				}}
			>
				Choose Image
			</button>
			&nbsp;&nbsp;
			<button class="btn btn-warning mb-3" on:click={() => onSubmit()}>Submit </button>
		</div>

		<input
			style="display:none"
			type="file"
			accept=".jpg, .jpeg, .png"
			on:change={(e) => onFileSelected(e)}
			bind:this={fileinput}
		/>
	</div>
</div>

<style>
	#app {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-flow: column;
	}

	.upload {
		display: flex;
		height: 50px;
		width: 50px;
		cursor: pointer;
		margin: 10px;
	}
	.avatar {
		display: flex;
		height: 200px;
		width: 200px;
	}

	.avatar {
		max-width: 200px;
		max-height: 200px;
		border-radius: 10px;
		margin-top: 25px;
		border: 2px solid orange;
		padding: 20px;
	}
</style>
