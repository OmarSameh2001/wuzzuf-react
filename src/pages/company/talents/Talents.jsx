import { useEffect, useState } from "react";

const Talents = () => {
  const [jobseekers, setJobseekers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/jobseekers/all") 
      .then((response) => response.json())
      .then((data) => {
        setJobseekers(data.results);
      })
      .catch((error) => console.error("Error fetching jobseekers:", error));
  }, []);

  return (
    <div className="flex flex-col items-center p-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-4">Talents</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobseekers.length > 0 ? (
          jobseekers.map((jobseeker, index) => {
            console.log(`Jobseeker ${index + 1}:`, jobseeker); // Log each jobseeker

            return (
              <div key={jobseeker.id} className="relative border rounded-lg p-4 shadow-md">
                {/* Small Image in Top Left */}
                <img 
                  src={jobseeker.img || "/default-avatar.jpg"} 
                  alt={jobseeker.name || "Unnamed Jobseeker"} 
                  className="w-5 h-5 rounded-full absolute top-2 left-2 border border-white shadow-md"
                  width={'80px'}
                />

                {/* Jobseeker Details */}
                <div className="pl-8">
                  {jobseeker.name && <h2 className="text-xl font-semibold mt-2">{jobseeker.name}</h2>}
                  {jobseeker.username && <p className="text-gray-600">{jobseeker.username}</p>}
                  {jobseeker.email && <p className="text-gray-500">{jobseeker.email}</p>}
                  
                  {jobseeker.education && (
                    <p><strong>Education:</strong> {jobseeker.education}</p>
                  )}
                  
                  {jobseeker.experience && (
                    <p><strong>Experience:</strong> {jobseeker.experience}</p>
                  )}

                  {jobseeker.location && (
                    <p><strong>Location:</strong> {jobseeker.location}</p>
                  )}

                  {jobseeker.keywords && jobseeker.keywords.length > 0 && (
                    <p><strong>Keywords:</strong> {jobseeker.keywords.join(", ")}</p>
                  )}

                  {jobseeker.cv && (
                    <a 
                      href={jobseeker.cv} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-500 hover:underline mt-2 block"
                    >
                      View CV
                    </a>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">Loading jobseekers...</p>
        )}
      </div>
    </div>
  );
};

export default Talents;
