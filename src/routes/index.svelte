<script>
	import GuestList from '../components/GuestList.svelte';
	import { onMount } from 'svelte';
	import axios from 'axios';

	let users = [];

	async function handleDelete(e) {
		const payload = e.detail;
		const resp = await axios.delete(`http://localhost:4000/api/delete/${payload}`);
		update();
	}

	async function update() {
		console.log('in update');
		const response = await axios.get('http://localhost:4000/api/users');
		console.log(response.data);
		users = response.data;
	}

	onMount(async function () {
		const response = await axios.get('http://localhost:4000/api/users');
		users = response.data;
		console.log(users);
	});
</script>

<div class="container">
	<div>
		<h1 class="text-4xl ">Ryan's Guest Book</h1>
	</div>

	<div>
		<GuestList {users} on:delete={handleDelete} on:navigate />
	</div>
</div>

<style>
	h1 {
		padding-bottom: 10px;
		border-bottom: 2px solid rgba(255, 166, 0, 0.479);
	}

	.container {
		color: gray;
		text-align: center;
	}
</style>
