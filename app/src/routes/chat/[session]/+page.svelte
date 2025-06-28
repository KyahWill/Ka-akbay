<script lang="ts">
  import { page } from '$app/stores';
  import { adkApi, type ChatMessage } from '$lib/api';
  import { dbHelpers } from '$lib/db';
  import { onMount } from 'svelte';

  const sessionId = $derived($page.params.session);

  let messages = $state<ChatMessage[]>([]);
  let newMessage = $state('');
  let isLoading = $state(false);
  let isSending = $state(false);
  let error = $state<string | null>(null);
  let session = $state<any>(null);

  onMount(async () => {
    await loadSession();
    await loadMessages();
    
    // Send initial "Hello!" message if this is a new session
    if (messages.length === 0) {
      await sendInitialMessage();
    }
  });

  async function loadSession() {
    try {
      session = await dbHelpers.getSession(sessionId);
      if (!session) {
        error = 'Session not found';
      }
    } catch (err) {
      console.error('Failed to load session:', err);
      error = 'Failed to load session';
    }
  }

  async function loadMessages() {
    try {
      const localMessages = await dbHelpers.getSessionMessages(sessionId);
      messages = localMessages;
    } catch (err) {
      console.error('Failed to load messages:', err);
      error = 'Failed to load messages';
    }
  }

  async function sendInitialMessage() {
    const initialMessage: ChatMessage = {
      id: Date.now().toString(),
      content: "Hello!",
      role: 'user',
      timestamp: new Date()
    };

    try {
      // Add user message to local database
      await dbHelpers.addMessage({
        sessionId,
        content: initialMessage.content,
        role: initialMessage.role,
        timestamp: initialMessage.timestamp
      });

      // Add to local state
      messages = [...messages, initialMessage];

      // Send to ADK server
      const assistantMessage = await adkApi.sendMessage(sessionId, initialMessage.content);

      // Add assistant message to local database
      await dbHelpers.addMessage({
        sessionId,
        content: assistantMessage.content,
        role: assistantMessage.role,
        timestamp: assistantMessage.timestamp
      });

      // Add to local state
      messages = [...messages, assistantMessage];

    } catch (err) {
      console.error('Failed to send initial message:', err);
      error = err instanceof Error ? err.message : 'Failed to send initial message';
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      role: 'user',
      timestamp: new Date()
    };

    try {
      isSending = true;
      error = null;

      // Add user message to local database
      await dbHelpers.addMessage({
        sessionId,
        content: userMessage.content,
        role: userMessage.role,
        timestamp: userMessage.timestamp
      });

      // Add to local state
      messages = [...messages, userMessage];

      // Send to ADK server
      const assistantMessage = await adkApi.sendMessage(sessionId, userMessage.content);

      // Add assistant message to local database
      await dbHelpers.addMessage({
        sessionId,
        content: assistantMessage.content,
        role: assistantMessage.role,
        timestamp: assistantMessage.timestamp
      });

      // Add to local state
      messages = [...messages, assistantMessage];

      // Clear input
      newMessage = '';

    } catch (err) {
      console.error('Failed to send message:', err);
      error = err instanceof Error ? err.message : 'Failed to send message';
    } finally {
      isSending = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
</script>

<div class="flex flex-col h-screen bg-base-200">
  <!-- Header -->
  <div class="navbar bg-base-100 shadow-sm">
    <div class="flex-1 lg:mx-0 ml-20">
      <h1 class="text-xl font-semibold">
        {session?.name || 'Mental Health Chat'}
      </h1>
    </div>
    <div class="flex-none">
      <a href="/chat" class="btn btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Chat
      </a>
    </div>
  </div>

  <!-- Messages Area -->
  <div class="flex-1 overflow-y-auto p-4 space-y-4">
    {#if error}
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    {/if}

    {#if isLoading}
      <div class="flex justify-center">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {:else if messages.length === 0}
      <div class="text-center text-base-content/70 py-8">
        <div class="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium mb-2">Welcome to your mental health session</h3>
        <p>Start a conversation with our counselor. You can ask questions, share your thoughts, or seek guidance.</p>
      </div>
    {:else}
      {#each messages as message (message.id)}
        <div class="chat {message.role === 'user' ? 'chat-end' : 'chat-start'}">
          <div class="chat-bubble {message.role === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'}">
            <p class="whitespace-pre-wrap">{message.content}</p>
            <div class="chat-footer opacity-50 text-xs mt-1">
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      {/each}
    {/if}

    {#if isSending}
      <div class="chat chat-start">
        <div class="chat-bubble chat-bubble-secondary">
          <span class="loading loading-dots loading-sm"></span>
          <span class="ml-2">Thinking...</span>
        </div>
      </div>
    {/if}
  </div>

  <!-- Input Area -->
  <div class="p-4 bg-base-100 border-t">
    <div class="flex space-x-2">
      <textarea
        bind:value={newMessage}
        on:keypress={handleKeyPress}
        placeholder="Type your message here..."
        class="textarea textarea-bordered flex-1 resize-none"
        rows="1"
        disabled={isSending}
      ></textarea>
      <button
        on:click={sendMessage}
        disabled={!newMessage.trim() || isSending}
        class="btn btn-primary"
      >
        {#if isSending}
          <span class="loading loading-spinner loading-sm"></span>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        {/if}
      </button>
    </div>
  </div>
</div> 