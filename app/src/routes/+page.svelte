<script lang="ts">
  import { goto } from '$app/navigation';
  
  function startChat() {
    goto('/chat');
  }
  
  function scrollToFeatures() {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }
</script>

<svelte:head>
  <title>Mental Health Chat - Professional Counseling Support</title>
  <meta name="description" content="Get professional mental health support and counseling through our AI-powered chat platform. Confidential, accessible, and available 24/7." />
</svelte:head>

<!-- Hero Section -->
<div class="hero min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
  <div class="hero-content text-center">
    <div class="max-w-4xl">
      <div class="mb-8">
        <div class="badge badge-primary mb-4">AI-Powered Mental Health Support</div>
        <h1 class="text-5xl font-bold mb-6">
          Professional Mental Health
          <span class="text-primary">Counseling</span>
          <br />
          <span class="text-2xl font-normal text-base-content/70">Available 24/7</span>
        </h1>
        <p class="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
          Connect with our compassionate AI counselor for confidential support, guidance, and resources. 
          Get help with stress, anxiety, depression, and more in a safe, judgment-free environment.
        </p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button class="btn btn-primary btn-lg" on:click={startChat}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Start Chat Now
        </button>
        <button class="btn btn-outline btn-lg" on:click={scrollToFeatures}>
          Learn More
        </button>
      </div>
      
      <div class="mt-12 flex justify-center items-center space-x-8 text-sm text-base-content/60">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Confidential & Secure
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Available 24/7
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          No Location Barriers
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Features Section -->
<div id="features" class="py-20 bg-base-100">
  <div class="container mx-auto px-4">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold mb-4">How We Can Help</h2>
      <p class="text-xl text-base-content/70 max-w-2xl mx-auto">
        Our AI counselor provides professional support for various mental health concerns
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Feature 1 -->
      <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
        <div class="card-body text-center">
          <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 class="card-title justify-center">Emotional Support</h3>
          <p class="text-base-content/70">
            Get compassionate listening and emotional support for stress, anxiety, depression, and life challenges.
          </p>
        </div>
      </div>

      <!-- Feature 2 -->
      <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
        <div class="card-body text-center">
          <div class="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 class="card-title justify-center">Coping Strategies</h3>
          <p class="text-base-content/70">
            Learn practical coping techniques and strategies to manage difficult emotions and situations.
          </p>
        </div>
      </div>

      <!-- Feature 3 -->
      <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
        <div class="card-body text-center">
          <div class="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="card-title justify-center">Resource Connection</h3>
          <p class="text-base-content/70">
            Connect with professional therapists, support groups, and mental health resources in your area.
          </p>
        </div>
      </div>

      <!-- Feature 4 -->
      <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
        <div class="card-body text-center">
          <div class="w-16 h-16 bg-info/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="card-title justify-center">Mental Health Education</h3>
          <p class="text-base-content/70">
            Access reliable information about mental health conditions, treatments, and wellness practices.
          </p>
        </div>
      </div>

      <!-- Feature 5 -->
      <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
        <div class="card-body text-center">
          <div class="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="card-title justify-center">Crisis Support</h3>
          <p class="text-base-content/70">
            Immediate support and guidance for crisis situations with connections to emergency resources.
          </p>
        </div>
      </div>

      <!-- Feature 6 -->
      <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
        <div class="card-body text-center">
          <div class="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="card-title justify-center">Privacy & Security</h3>
          <p class="text-base-content/70">
            Your conversations are confidential and secure. We prioritize your privacy and data protection.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- How It Works Section -->
<div class="py-20 bg-base-200">
  <div class="container mx-auto px-4">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold mb-4">How It Works</h2>
      <p class="text-xl text-base-content/70 max-w-2xl mx-auto">
        Getting help is simple and straightforward
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Step 1 -->
      <div class="text-center">
        <div class="w-20 h-20 bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
          1
        </div>
        <h3 class="text-xl font-semibold mb-4">Start a Conversation</h3>
        <p class="text-base-content/70">
          Click "Start Chat" to begin a new session with our AI counselor. No registration required.
        </p>
      </div>

      <!-- Step 2 -->
      <div class="text-center">
        <div class="w-20 h-20 bg-secondary text-secondary-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
          2
        </div>
        <h3 class="text-xl font-semibold mb-4">Share Your Thoughts</h3>
        <p class="text-base-content/70">
          Talk about what's on your mind. Our counselor is here to listen and provide support.
        </p>
      </div>

      <!-- Step 3 -->
      <div class="text-center">
        <div class="w-20 h-20 bg-accent text-accent-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
          3
        </div>
        <h3 class="text-xl font-semibold mb-4">Get Support & Resources</h3>
        <p class="text-base-content/70">
          Receive guidance, coping strategies, and connections to professional resources.
        </p>
      </div>
    </div>
  </div>
</div>

<!-- CTA Section -->
<div class="py-20 bg-primary text-primary-content">
  <div class="container mx-auto px-4 text-center">
    <h2 class="text-4xl font-bold mb-6">Ready to Get Started?</h2>
    <p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
      Take the first step towards better mental health. Our AI counselor is ready to support you 24/7.
    </p>
    <button class="btn btn-secondary btn-lg" on:click={startChat}>
      Start Your Free Chat Session
    </button>
    <p class="text-sm opacity-75 mt-4">
      No registration required • Confidential • Available 24/7
    </p>
  </div>
</div>

<!-- Footer -->
<footer class="footer footer-center p-10 bg-base-300 text-base-content">
  <div>
    <p class="font-bold">
      Mental Health Chat <br/>
      Professional AI Counseling Support
    </p> 
    <p>Copyright © 2024 - All rights reserved</p>
  </div> 
  <div>
    <div class="grid grid-flow-col gap-4">
      <a class="link link-hover">About us</a> 
      <a class="link link-hover">Contact</a> 
      <a class="link link-hover">Privacy Policy</a> 
      <a class="link link-hover">Terms of Service</a>
    </div>
  </div>
</footer>
