<script>
	export let currentTheme = 'dark';

	import moon from '$lib/images/theme-icons/dark.png';
	import sun from '$lib/images/theme-icons/white.png';
</script>

<button
	on:click={() => {
		if (currentTheme == 'dark') currentTheme = 'light';
		else currentTheme = 'dark';
	}}
>
	{#if currentTheme == 'dark'}
		<img width="50" src={sun} alt="" />
	{:else}
		<img width="50" src={moon} alt="" />
	{/if}

	<slot />
</button>

<style>
	button {
		font-style: italic;
	}
</style>
