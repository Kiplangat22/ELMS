import user1 from "@/assets/images/user1.jpg";
import user2 from "@/assets/images/user2.jpg";
import user3 from "@/assets/images/user3.jpg";


type Testimonial = {
    id: number;
    name: string;
    role: string;
    image: string;
    content: string;
};

export const testimonialsData: Testimonial[] = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'HR Manager',
        image: user1,
        content: 'ELMS has revolutionized our leave management process. The system is intuitive and has significantly reduced administrative overhead.',
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Team Lead',
        image: user3,
        content: 'With ELMS, approving leave requests is quick and efficient. I can manage my team\'s schedule with ease.',
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        role: 'Software Developer',
        image: user1,
        content: 'The ability to track my leave balance in real-time has made planning vacations so much easier. Highly recommend ELMS!',
    },
    {
        id: 4,
        name: 'David Thompson',
        role: 'Operations Manager',
        image: user2,
        content: 'ELMS provides excellent visibility into team availability. It helps us plan projects more effectively.',
    },
    {
        id: 5,
        name: 'Lisa Wang',
        role: 'Marketing Director',
        image: user1,
        content: 'The notification system keeps everyone informed. No more confusion about who is out and when.',
    },
    {
        id: 6,
        name: 'James Wilson',
        role: 'Finance Manager',
        image: user3,
        content: 'ELMS has streamlined our leave tracking and reporting. The analytics dashboard is particularly useful.',
    },
    {
        id: 7,
        name: 'Anna Martinez',
        role: 'Product Designer',
        image: user1,
        content: 'I love how simple it is to submit leave requests. The mobile-friendly interface is a huge plus.',
    },
    {
        id: 8,
        name: 'Robert Taylor',
        role: 'IT Administrator',
        image: user2,
        content: 'Implementing ELMS was seamless. The system integrates well with our existing HR processes.',
    },
];