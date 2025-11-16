import serviceIMG from "../assets/images/services.jpg";


export const Services = () => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-fit p-4 md:p-8">
            <div className="w-full md:w-1/2 flex items-center mb-6 md:mb-0">
                <img src={serviceIMG} alt="our services" />
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-600">Our Services</h2>
                <p className="mb-4 text-gray-700 text-base md:text-lg">
                    Discover the range of services ELMS offers to help your organization manage employee leave efficiently. 
                    From leave applications to approval workflows, we have you covered!
                </p>
                <div>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Service</th>
                                    <th>Description</th>
                                    <th>Benefit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>1</th>
                                    <td>Leave Application</td>
                                    <td>Easy online submission</td>
                                    <td>Save time</td>
                                </tr>
                                <tr>
                                    <th>2</th>
                                    <td>Quick Approvals</td>
                                    <td>Manager review system</td>
                                    <td>Fast processing</td>
                                </tr>
                                <tr>
                                    <th>3</th>
                                    <td>Leave Balance</td>
                                    <td>Real-time tracking</td>
                                    <td>Transparency</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <button className="btn btn-primary">Get Started</button>
            </div>
        </div>
    )
}