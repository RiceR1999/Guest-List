<script>
	import { userStore, tokenStore } from '../stores/userStore';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleSignout() {
		tokenStore.set('');
		userStore.set('');
		location.reload();
	}
</script>

<div class="container">
	<ul>
		<li>
			<a href="/" class="link">Home</a>
		</li>
		<li>
			<a href="/about" class="link">About</a>
		</li>

		<li>
			<a href="/signup" class="link">Signup</a>
		</li>
	</ul>

	<p>Hello {$userStore}</p>

	<ul>
		<li>
			<a href="/signin" class="link">Sign In</a>
		</li>
		<li>
			<a class="link" on:click={() => handleSignout()}>Sign Out</a>
		</li>
	</ul>
</div>

<style>
	p {
		padding: 7px;
		margin-left: 25px;
		border: 2px solid orange;
		border-radius: 10px;
	}
	.container {
		background-color: aliceblue;
		display: flex;
	}
	ul {
		display: flex;
		list-style-type: none;
	}
	li {
		padding: 10px;
	}

	.link {
		color: grey;
		border-bottom: 2px solid orange;
	}
	.link:hover {
		color: orange;
		cursor: pointer;
	}
	.link:visited {
		color: grey;
	}
	.link:active {
		color: orange;
	}
</style>
