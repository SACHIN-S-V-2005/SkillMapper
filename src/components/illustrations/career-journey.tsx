export function CareerJourneyIllustration(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g fill="none" fillRule="evenodd">
                <path d="M100 200c55.228 0 100-44.772 100-100S155.228 0 100 0 0 44.772 0 100s44.772 100 100 100z" fill="#F0F4FF"/>
                <path d="M60 140V70c0-5.523 4.477-10 10-10h60c5.523 0 10 4.477 10 10v70" stroke="#6C63FF" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 8"/>
                <path d="M60 140h80" stroke="#6C63FF" strokeWidth="6" strokeLinecap="round"/>

                <circle fill="#FFF" stroke="#6C63FF" strokeWidth="4" cx="70" cy="140" r="10"/>
                <circle fill="#FFF" stroke="#6C63FF" strokeWidth="4" cx="130" cy="140" r="10"/>

                <g transform="translate(85 40)">
                    <path d="M15 0L30 30H0z" fill="#B9D0FF"/>
                    <path d="M15 40L30 70H0z" fill="#6C63FF"/>
                </g>
                <g transform="translate(60 90)">
                    <rect fill="#FFFFFF" y="0" width="80" height="40" rx="8"/>
                    <path stroke="#B9D0FF" strokeWidth="4" strokeLinecap="round" d="M10 10h60M10 20h40M10 30h20"/>
                </g>
            </g>
        </svg>
    )
}
