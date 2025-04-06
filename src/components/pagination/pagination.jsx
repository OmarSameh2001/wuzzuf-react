export default function CustomPagination({
  page,
  setPage,
  pageSize,
  setPageSize,
  total,
}) {
  return (
    <div className="d-flex gap-1 mt-3">
      <button
        disabled={page === 1}
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        className="btn btn-primary"
      >
        Previous
      </button>
      <select
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
      >
        {[10, 20, 30].map((size) => (
          <option key={size} value={size}>
            {size} per page
          </option>
        ))}
      </select>
      <button
        disabled={page * pageSize >= total}
        onClick={() => setPage((prev) => prev + 1)}
        className="btn btn-primary"
      >
        Next
      </button>
    </div>
  );
}
