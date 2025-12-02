import homeIMG from "../assets/images/home.png";

export const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row justify-between items-stretch gap-10 min-h-[80vh] p-6 md:p-12 bg-gradient-to-tr from-[#f5f7fa] via-[#c3cfe2] to-[#e2ebf0] text-gray-800">

        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-500">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Welcome to ELMS!
          </h1>
          <p className="mb-4 text-lg leading-relaxed text-gray-700">
            Streamline your organization's leave management with <span className="font-semibold text-indigo-600">ELMS</span> - the ultimate employee leave management system for modern workplaces.
          </p>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            Empower your HR team with an intuitive dashboard, real-time leave tracking, and powerful reporting tools.
          </p>

          <button className="self-start px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 rounded-full font-semibold text-white shadow-lg hover:scale-105 transition-transform duration-300">
            Get Started
          </button>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex justify-center items-stretch">
          <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={homeIMG}
              alt="Home Illustration"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

      </section>
  );
};
