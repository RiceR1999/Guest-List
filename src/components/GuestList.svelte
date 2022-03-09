<script>
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';

	export let users;
	export let errors;

	let dispatch = createEventDispatcher();

	function handleDelete(_id) {
		dispatch('delete', _id);
	}
</script>

<div class="content">
	{#if errors.error != ''}
		<div class="fl-r">
			<p>{errors.error}</p>
		</div>
	{:else}
		{#each users as guest}
			<div class="fl">
				<p on:click={() => goto(`/users/${guest._id}`)}>
					{guest.userName}
				</p>
				<i class="fa-solid fa-xmark hover" on:click={() => handleDelete(guest._id)} />
			</div>
		{/each}
	{/if}
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
	.fl-r {
		background-color: rgb(216, 146, 146);
		border: 2px solid rgb(255, 255, 255);
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
