<script lang="ts">
	let { children } = $props();

  import { liveQuery } from "dexie";
  import { db } from "$lib/db";
  import {onMount} from 'svelte'

  
  let sessions = $derived(
    liveQuery(async () => {
      const friends = await db.sessions
        .toArray();
      console.log(friends)
      return friends;
    })
  );

</script>

<div class="drawer lg:drawer-open">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col items-center justify-center">
    <!-- Page Content Here -->
		{@render children()}
    <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">
      Open drawer
    </label>
  </div>
  <div class="drawer-side">
    <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
      <!-- Sidebar content here -->
			{#if $sessions}
        {#each $sessions as friend (friend.id)}
          <li>{friend.name}</li>
        {/each}
      {/if}
    </ul>
  </div>
</div>
