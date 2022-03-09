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
	export let id;

	import SideBar from '../../../components/SideBar.svelte';
	import NavBar from '../../../components/NavBar.svelte';
	import { onMount } from 'svelte';
	import { tokenStore } from '../../../stores/userStore';
	import axios from 'axios';
	let open = false;
	let fileinput;
	let dataArray;
	let avatar;
	let user = { userName: '', password: '', _id: '', avatarId: '', pdfId: '' };

	const onFileSelected = (e) => {
		dataArray = new FormData();
		let pdf = e.target.files[0];
		dataArray.append('file', pdf);
		console.log(dataArray);
		console.log(e.target.files[0]);

		let reader = new FileReader();
		reader.readAsDataURL(pdf);
		reader.onload = (e) => {
			avatar = e.target.result;
			console.log(avatar);
		};
	};

	async function onSubmit(e) {
		console.log(dataArray);
		await axios.post(`http://localhost:4000/api/user/pdf/${id}`, dataArray, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${$tokenStore}`
			}
		});
		update();
	}

	onMount(async () => {
		const res = await axios.get(`http://localhost:4000/api/user/${id}`, {
			headers: { Authorization: `Bearer ${$tokenStore}` }
		});
		user = res.data;
		console.log(user);
	});

	async function update() {
		const res = await axios.get(`http://localhost:4000/api/user/${id}`, {
			headers: { Authorization: `Bearer ${$tokenStore}` }
		});
		user = res.data;
		console.log(user);
	}
</script>

<div class="text-center border-orange-300 card bg-gray-50">
	<div>
		<SideBar bind:open {id} />
		<NavBar bind:sidebar={open} />
		<h2 class="pb-4 pt-3 border-b-2 border-orange-300 mb-3">{id}</h2>
	</div>
	<h1 class="pb-3">Upload PDF</h1>
	<h1 class="pb-3">{user.userName}</h1>
	<div id="app">
		<div class="avatar">
			{#if !user.pdfId}
				<p class="p-5 text-center text-orange-300" id="app">Waiting...</p>
			{:else}
				<a
					class="m-16 text-center text-orange-300"
					href="http://localhost:4000/api/pdf/{user.pdfId}"
					target="_blank">PDF</a
				>
			{/if}
		</div>
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
				Choose PDF
			</button>
			&nbsp;&nbsp;
			<button class="btn btn-warning mb-3" on:click={() => onSubmit()}>Submit </button>
		</div>
		<input
			style="display:none"
			type="file"
			accept=".pdf"
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
