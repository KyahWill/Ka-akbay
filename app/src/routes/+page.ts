export const load = async ({ url }: { url: URL }) => {
	// This data will be loaded on the server during SSR
	// and hydrated on the client
	const pageData = {
		title: 'Mental Health Chat - Professional Counseling Support',
		description: 'Get professional mental health support and counseling through our AI-powered chat platform. Confidential, accessible, and available 24/7.',
		features: [
			{
				title: 'Emotional Support',
				description: 'Get compassionate listening and emotional support for stress, anxiety, depression, and life challenges.',
				icon: 'heart'
			},
			{
				title: 'Coping Strategies',
				description: 'Learn practical coping techniques and strategies to manage difficult emotions and situations.',
				icon: 'lightbulb'
			},
			{
				title: 'Resource Connection',
				description: 'Connect with professional therapists, support groups, and mental health resources in your area.',
				icon: 'location'
			}
		],
		// Server-side timestamp for demonstration
		serverTime: new Date().toISOString(),
		// URL information available during SSR
		url: url.pathname
	};

	return pageData;
}; 