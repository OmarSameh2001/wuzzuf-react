import TalentCard from "../../../components/talent/TalentCard";
import { useQuery } from "@tanstack/react-query";
import { getTalents } from "../../../services/Talents";
import { useContext, useState } from "react";
import { userContext } from "../../../context/UserContext";
import { useNavigate } from "react-router";
import CustomPagination from "../../../components/pagination/pagination";
import { Button, TextField } from "@mui/material";
function Talents() {
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    name: "",
    experience: "",
    location: "",
    skills: "",
  });
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    experience: "",
    location: "",
    skills: "",
  });

  const handleReset = () => {
    setFilters({
      name: "",
      experience: "",
      location: "",
      skills: "",
    });
    setSearchFilters({
      name: "",
      experience: "",
      location: "",
      skills: "",
    });
    setPage(1);
    talentsRefetch();
  };
  const {
    data: talents,
    error: talentsError,
    isLoading: talentsLoading,
    refetch: talentsRefetch,
  } = useQuery({
    queryKey: ["talents", page, pageSize, searchFilters],
    queryFn: async () => {
      const res = await getTalents({ filters: searchFilters, page, pageSize });
      setTotal(res.count);
      return res.results;
    },
    keepPreviousData: true,
  });

  if (talentsLoading) return <p>Loading...</p>;
  if (talentsError) return <p>Error loading talents.</p>;

  return (
    <>
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: "1rem" }}>Talents</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearchFilters({
              name: filters.name,
              experience: filters.experience,
              location: filters.location,
              skills: filters.skills,
            });
          }}
        >
          <div style={{ display: "flex", gap: "1rem" }}>
            <TextField
              label="Name"
              value={filters.name}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <TextField
              label="Experience"
              value={filters.experience}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  experience: e.target.value,
                }))
              }
            />
            <TextField
              label="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
            />
            <TextField
              label="Skills"
              value={filters.skills}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, skills: e.target.value }))
              }
            />
            <Button type="submit" variant="contained">
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleReset()}
            >
              Reset
            </Button>
          </div>
        </form>
      </header>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems:'center', justifyContent:'center' }}>
        {talents?.map((talent) => (
          <TalentCard
            key={talent.id}
            img={talent.img}
            name={talent.name}
            description={talent.about}
          />
        ))}
      </div>

      <CustomPagination
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        total={total}
      />
    </>
  );
}

export default Talents;

