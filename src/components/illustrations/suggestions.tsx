export function SuggestionsIllustration(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g fill="none" fillRule="evenodd">
                <path d="M100 200c55.228 0 100-44.772 100-100S155.228 0 100 0 0 44.772 0 100s44.772 100 100 100z" fill="#F0F4FF"/>
                <g transform="translate(50 30)">
                    {/* Lightbulb */}
                    <path d="M50 0C22.386 0 0 22.386 0 50c0 17.347 8.81 32.613 22 41.88V105c0 8.284 6.716 15 15 15h26c8.284 0 15-6.716 15-15v-13.12C91.19 82.613 100 67.347 100 50 100 22.386 77.614 0 50 0z" fill="#FFF"/>
                    <path d="M50 0C22.386 0 0 22.386 0 50c0 17.347 8.81 32.613 22 41.88V105c0 8.284 6.716 15 15 15h26c8.284 0 15-6.716 15-15v-13.12C91.19 82.613 100 67.347 100 50 100 22.386 77.614 0 50 0z" stroke="#6C63FF" strokeWidth="4"/>
                    <path d="M37 120h26c4.418 0 8 3.582 8 8v12h-42v-12c0-4.418 3.582-8 8-8z" fill="#D6E2FF"/>
                    <path d="M40 80h20" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M30 65h40" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M40 50h20" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
                </g>

                 {/* Stars */}
                <path d="M29 34l-4.24 8.76L16 44l7.39 7.19L21.53 62 29 57.24 36.47 62 34.61 51.19 42 44l-8.76-1.24z" fill="#FFD700"/>
                <path d="M171 114l-4.24 8.76-8.76 1.24 7.39 7.19-1.88 10.81L171 137.24l7.47 4.76-1.88-10.81 7.39-7.19-8.76-1.24z" fill="#B9D0FF"/>
                <path d="M150 25l-2.12 4.38-4.38.62 3.69 3.6- .94 5.4L150 36.62l3.73 2.38-.94-5.4 3.69-3.6-4.38-.62z" fill="#B9D0FF"/>

            </g>
        </svg>
    )
}
