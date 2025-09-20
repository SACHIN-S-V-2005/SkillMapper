export function InterviewerIllustration({ isListening, ...props }: React.SVGProps<SVGSVGElement> & { isListening: boolean }) {
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g fill="none" fillRule="evenodd">
                {/* Background Circle */}
                <circle fill="#F0F4FF" cx="100" cy="100" r="100"/>
                
                {/* Main Head */}
                <circle fill="#6C63FF" cx="100" cy="100" r="80"/>
                
                {/* Face Plate */}
                <path d="M50 100a50 50 0 0150-50h0a50 50 0 0150 50v30a10 10 0 01-10 10H60a10 10 0 01-10-10v-30z" fill="#FFF"/>

                {/* Eyes */}
                <g fill="#4A4A4A">
                    <circle cx="80" cy="90" r="8"/>
                    <circle cx="120" cy="90" r="8"/>
                </g>

                {/* Mouth/Speaker area */}
                <g transform="translate(85 115)">
                    <rect fill={isListening ? "#4CAF50" : "#D6E2FF"} width="30" height="10" rx="5"/>
                     {isListening && (
                        <>
                         <line x1="-10" y1="5" x2="0" y2="5" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round">
                            <animate attributeName="x1" values="-10;-5;-10" dur="1s" repeatCount="indefinite" />
                         </line>
                         <line x1="30" y1="5" x2="40" y2="5" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round">
                             <animate attributeName="x2" values="40;45;40" dur="1s" repeatCount="indefinite" />
                         </line>
                        </>
                    )}
                </g>
                
                {/* Antenna */}
                <path stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round" d="M100 20v-10"/>
                <circle fill="#FFD700" cx="100" cy="10" r="5"/>
                
                 {/* Ears */}
                <rect fill="#B9D0FF" x="15" y="85" width="10" height="30" rx="5"/>
                <rect fill="#B9D0FF" x="175" y="85" width="10" height="30" rx="5"/>
            </g>
        </svg>
    )
}
