function JobDetails({ job }) {
  console.log(job);
  if(job) return (
      <div className="mt-4" style={{maxWidth:'100vw', minWidth:'50vw'}}>
        <div className="card p-4 shadow-sm">
          <h2 className="text-primary">{job.title}</h2>
          <div className="d-flex align-items-center mt-1">
            <img
              src={job.company_logo || 'https://static.thenounproject.com/png/3198584-200.png'}
              alt={job.company_name}
              className="rounded-circle me-3"
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
            <p className="mb-0">
              <strong>Company:</strong> {job.company_name}
            </p>
          </div>
          <p><strong>Description: </strong>{job.description}</p>

          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                {/* <strong>Skills:</strong> {job.keywords.join(", ")} */}
              </p>
              <p>
                <strong>Experience:</strong> {job.experince}
              </p>
            </div>
            <div className="col-md-6">
              <p style={{ color: job.status === "1" ? "black" : "red" }}>
                <strong>Status:</strong> {job.status === "1" ? "Open" : "Closed"}
              </p>
              <p>
                <strong>Type of Job:</strong> {job.type_of_job}
              </p>
              <p>
                <strong>Attendance Style:</strong> {job.attend}
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default JobDetails;
