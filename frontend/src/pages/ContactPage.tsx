export default function ContactPage() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">

        {/* Coordinator Image */}
        <div className="flex justify-center mb-6">
          <img
            src="/coordinator.png"   // Put image inside public folder
            alt="Dr. G. Syam Kumar"
            className="w-72 shadow-lg"
          />
        </div>

        {/* Coordinator Details */}
        <h2 className="text-2xl font-semibold text-gray-800">
          Dr. G. Syam Kumar
        </h2>

        <p className="mt-2 text-gray-700">
          I/c Programme Coordinator
        </p>

        <p className="text-gray-700">
          Ground Floor, Administrative Building,
        </p>

        <p className="text-gray-700">
          Jawaharlal Nehru Technological University Kakinada,
        </p>

        <p className="text-gray-700">
          Kakinada - 533003, Andhra Pradesh, India
        </p>

        <p className="text-gray-700 mt-2">
          Email: coordinator.nss@jntuk.edu.in
        </p>

        <p className="text-gray-700">
          Phone: 7702862555, 0884-2357898
        </p>

        {/* Assistant */}
        <div className="mt-8">
          <h3 className="font-semibold text-gray-800">
            B. SRINIVASU
          </h3>

          <p className="text-gray-700">
            Jr. Assistant
          </p>

          <p className="text-gray-700">
            Email: jntuknsscell@gmail.com
          </p>

          <p className="text-gray-700">
            Phone: 0884-2357898
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-5xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          About the Programme Coordinator:
        </h2>

        <p className="text-gray-700 leading-relaxed mb-6">
          Dr. G. Syam Kumar is currently working as I/c Programme Coordinator
          in the Department of Physical Education at Jawaharlal Nehru
          Technological University Kakinada, Andhra Pradesh.
          He received his Ph.D. from Sri Krishna Devaraya University,
          Ananthapuram, Andhra Pradesh. He has more than 14 years of
          teaching and research experience.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          He has served as Secretary, Sports Council, JNTUK Kakinada
          and coordinated various inter-collegiate tournaments.
        </p>

        <p className="text-gray-700 leading-relaxed">
          He received appreciation from the Hon’ble Vice Chancellor,
          JNTUK Kakinada for his committed work in completing
          the Modern Indoor Stadium within stipulated time.
        </p>
      </div>
    </div>
  );
}