<script lang="ts">
  import { goto } from '$app/navigation';
  import { adkApi } from '$lib/api';
  import { dbHelpers } from '$lib/db';
  import { onMount } from 'svelte';

  let isLoading = $state(false);
  let error = $state<string | null>(null);

  onMount(async () => {
    await createNewSession();
  });

  async function createNewSession() {
    try {
      isLoading = true;
      error = null;


      // Create session with ADK server
      const session = await adkApi.createSession('default-user');
      
      // Create session in local database
      const sessionName = `Chat Session ${new Date().toLocaleDateString()}`;
      await dbHelpers.createSession({
        uuid: session.id,
        name: sessionName,
        userId: session.userId,
        sessionId: session.sessionId
      });

      // Redirect to the session page
      goto(`/chat/${session.sessionId}`);
      
    } catch (err) {
      console.error('Failed to create session:', err);
      error = err instanceof Error ? err.message : 'Failed to create session';
    } finally {
      isLoading = false;
    }
  }

  async function retry() {
    await createNewSession();
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-base-200">
  <div class="card w-96 bg-base-100 shadow-xl">
    <div class="card-body">
      {#if isLoading}
        <div class="flex flex-col items-center space-y-4">
          <span class="loading loading-spinner loading-lg"></span>
          <h2 class="card-title">Creating new chat session...</h2>
          <p class="text-center text-base-content/70">
            Please wait while we set up your conversation with the mental health agent.
          </p>
        </div>
      {:else if error}
        <div class="flex flex-col items-center space-y-4">
          <div class="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Error creating session</span>
          </div>
          <p class="text-center text-base-content/70">{error}</p>
          <div class="card-actions justify-center">
            <button class="btn btn-primary" on:click={retry}>
              Try Again
            </button>
          </div>
        </div>
      {:else}
        <div class="flex flex-col items-center space-y-4">
          <h2 class="card-title">Welcome to Mental Health Chat</h2>
          <p class="text-center text-base-content/70">
            Click the button below to start a new conversation with our mental health counselor.
          </p>
          <div class="card-actions justify-center">
            <button class="btn btn-primary" on:click={createNewSession} disabled={isLoading}>
              {#if isLoading}
                <span class="loading loading-spinner loading-sm"></span>
              {/if}
              Start New Chat
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
