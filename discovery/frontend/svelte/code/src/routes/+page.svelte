<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import githubImage from '$lib/images/github.svg';
	import MyButton from '$lib/components/Button.svelte';

	let myTheme = 'light';
	let myStyle = '';

	$: if (myTheme == 'light') {
		myStyle = 'background-color: royalblue;';
	} else {
		myStyle = 'background-color: black;';
	}
</script>

<main style={myStyle}>
	{myTheme}
	<MyButton bind:currentTheme={myTheme}>
		{#if myTheme == 'light'}
			<p>Switch to dark theme!</p>
		{:else}
			<p>Switch to light theme!</p>
		{/if}
	</MyButton>

	<img src={githubImage} alt="My GithubLOGO" />
</main>

<a href="/about">Take me to About page</a>
