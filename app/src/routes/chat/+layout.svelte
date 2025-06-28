<script lang="ts">
	let { children } = $props();

  import { liveQuery } from "dexie";
  import { dbHelpers } from "$lib/db";
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let sessions = $derived(
    liveQuery(async () => {
      const sessions = await dbHelpers.getAllSessions();
      return sessions;
    })
  );

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  function truncateText(text: string, maxLength: number = 50): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  async function deleteSession(sessionId: string, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this session?')) {
      await dbHelpers.deleteSession(sessionId);
    }
  }
</script>

<div class="drawer lg:drawer-open">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col">
    <!-- Page Content Here -->
		{@render children()}
    <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden fixed top-4 left-4 z-50">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </label>
  </div>
  <div class="drawer-side">
    <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="bg-base-200 min-h-full w-80 p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-4">
          <a href="/" class="btn btn-ghost btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </a>
          <h2 class="text-lg font-semibold">Chat Sessions</h2>
        </div>
        <a href="/chat" class="btn btn-primary btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New
        </a>
      </div>

      <!-- Sessions List -->
      <div class="space-y-2">
        {#if $sessions && $sessions.length > 0}
          {#each $sessions as session (session.id)}
            <a 
              href={`/chat/${session.sessionId}`}
              class="card bg-base-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow text-left w-full block"
            >
              <div class="card-body p-4">
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-base truncate">{session.name}</h3>
                    <p class="text-sm text-base-content/70 mt-1">
                      {session.messageCount} messages
                    </p>
                    {#if session.lastMessageAt}
                      <p class="text-xs text-base-content/50 mt-1">
                        {formatDate(session.lastMessageAt)}
                      </p>
                    {/if}
                  </div>
                  <button
                    class="btn btn-ghost btn-xs text-error"
                    onclick={(e) => deleteSession(session.sessionId, e)}
                    aria-label="Delete session"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </a>
          {/each}
        {:else}
          <div class="text-center py-8 text-base-content/50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-sm">No chat sessions yet</p>
            <a href="/chat" class="btn btn-primary btn-sm mt-2">Start your first chat</a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
