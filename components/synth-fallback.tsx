interface SynthFallbackProps {
    providerDomain?: string;
    title?: string;
    itemType?: string;
}

const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
];

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

export function SynthFallback({ providerDomain = '', title = '', itemType = 'link' }: SynthFallbackProps) {
    const seed = providerDomain || title || itemType;
    const gradientIndex = hashString(seed) % gradients.length;
    const gradient = gradients[gradientIndex];

    const emoji = providerDomain.includes('youtube') || providerDomain.includes('youtu.be') ? '📹' :
        providerDomain.includes('twitter') || providerDomain.includes('x.com') ? '🐦' :
            providerDomain.includes('reddit') ? '🔴' :
                providerDomain.includes('github') ? '🐙' :
                    providerDomain.includes('medium') ? '📝' :
                        providerDomain.includes('linkedin') ? '💼' :
                            providerDomain.includes('instagram') ? '📷' :
                                providerDomain.includes('tiktok') ? '🎵' :
                                    providerDomain.includes('spotify') ? '🎧' :
                                        providerDomain.includes('amazon') ? '📦' :
                                            '🔖';

    return (
        <div
            className="w-full h-full flex items-center justify-center text-6xl"
            style={{ background: gradient }}
        >
            {emoji}
        </div>
    );
}
