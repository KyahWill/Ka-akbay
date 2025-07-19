<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	let { children } = $props();
	
	// Handle SSR-specific logic
	$effect(() => {
		if (browser) {
			// Client-side only code
			console.log('App loaded on client');
		}
	});
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="Professional mental health counseling and support available 24/7" />
	<meta name="theme-color" content="#570df8" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content="Mental Health Chat - Professional Counseling Support" />
	<meta property="og:description" content="Get professional mental health support and counseling through our AI-powered chat platform." />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={$page.url.href} />
	<meta property="twitter:title" content="Mental Health Chat - Professional Counseling Support" />
	<meta property="twitter:description" content="Get professional mental health support and counseling through our AI-powered chat platform." />
</svelte:head>

{@render children()}
