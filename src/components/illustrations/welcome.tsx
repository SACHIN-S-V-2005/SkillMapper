export function WelcomeIllustration(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g fill="none" fillRule="evenodd">
                <path fill="#F0F4FF" d="M0 0h500v500H0z"/>
                <g transform="translate(40 40)">
                <path d="M190.5 240.5l-40-60 40-50 50 30z" fill="#D6E2FF"/>
                <path d="M228.5 260.5l-40-70 20-50 60 50z" fill="#B9D0FF"/>
                <rect fill="#4A4A4A" x="140" y="240" width="140" height="20" rx="10"/>
                <circle fill="#6C63FF" cx="210" cy="150" r="100"/>
                <g transform="translate(150 90)">
                    <path d="M60 0C93.137 0 120 26.863 120 60v50H0V60C0 26.863 26.863 0 60 0z" fill="#FFF"/>
                    <rect fill="#FFE4B5" y="110" width="120" height="30" rx="15"/>
                    <circle fill="#F5F5F5" cx="60" cy="150" r="10"/>
                    <path d="M30 110h60v20H30z" fill="#FFDAB9"/>
                </g>
                <path d="M194.5 137.5c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20" fill="#FFE4B5"/>
                <path d="M264.5 137.5c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20" fill="#FFE4B5"/>
                <path d="M210 160c-16.569 0-30 13.431-30 30h60c0-16.569-13.431-30-30-30" fill="#FFF"/>
                <path d="M210 170a20 20 0 010 40" stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round"/>
                <circle fill="#4A4A4A" cx="185" cy="140" r="5"/>
                <circle fill="#4A4A4A" cx="235" cy="140" r="5"/>
                </g>
            </g>
        </svg>
    )
}
