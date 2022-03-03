<script>
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';

	export let users;
	let dispatch = createEventDispatcher();

	function handleDelete(_id) {
		dispatch('delete', _id);
	}
</script>

<div class="content">
	{#each users as guest}
		<div class="fl">
			<p on:click={() => goto(`/users/${guest._id}`)}>
				{guest.userName}
			</p>
			<i class="fa-solid fa-xmark hover" on:click={() => handleDelete(guest._id)} />
		</div>
	{/each}
</div>

<style>
	p {
		text-align: center;
		margin: 10px;
		padding: 10px;
	}
	.fl {
		background-color: whitesmoke;
		border: 2px solid orange;
		border-radius: 10px;
		margin: 25px;
	}
	.hover:hover {
		cursor: pointer;
	}
	.hover {
		float: right;
		margin-right: 10px;
		margin-bottom: 10px;
		transform: translateY(-35px);
	}
</style>
