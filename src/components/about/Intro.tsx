
import leaveManagement from "@/assets/images/home.png"

const Intro = () => {
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between gap-8 h-fit p-4 md:p-8">
                <div className="w-full md:w-1/2 flex items-center">
                    <img
                        src={leaveManagement}
                        alt="leave-management"
                        className="w-full h-48 md:h-full object-cover rounded-lg shadow-lg"
                    />
                </div>

                <div className="w-full md:w-1/2 border-2 border-gray-300 rounded-lg p-6 md:p-8 mb-6 md:mb-0">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-600">
                        About ELMS
                    </h1>
                    <p className="mb-4 text-gray-700 text-base md:text-lg">
                        ELMS is a comprehensive Employee Leave Management System designed to streamline leave request processes and enhance organizational efficiency.
                    </p>
                    <p className="mb-2 text-gray-700 text-base md:text-lg">
                        With ELMS, employees can easily submit leave requests, track their leave balance, and receive real-time updates on approval status.
                    </p>
                    <p className="text-gray-700 text-base md:text-lg">
                        Whether you're managing a small team or a large organization, ELMS provides the tools you need to manage employee leave effectively.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Intro