<script>
	export let data;

	$: user = data;
</script>

<p>Account is: {user.name}</p>
