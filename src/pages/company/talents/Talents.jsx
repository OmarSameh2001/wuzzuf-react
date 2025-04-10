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
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "2rem"
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: "1rem", color: "#901b20" }}>Talents</h1>
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
          style={{ width: '100%' }}
        >
          <div style={{ display: "flex", gap: "1rem", flexWrap: 'wrap', justifyContent: 'center' }}>
            <TextField
              label="Name"
              value={filters.name}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, name: e.target.value }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#901b20" },
                  "&:hover fieldset": { borderColor: "#901b20" },
                  "&.Mui-focused fieldset": { borderColor: "#901b20" }
                },
                "& .MuiInputLabel-root": { color: "#901b20" }
              }}
            />
            <TextField
              label="Experience"
              value={filters.experience}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, experience: e.target.value }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#901b20" },
                  "&:hover fieldset": { borderColor: "#901b20" },
                  "&.Mui-focused fieldset": { borderColor: "#901b20" }
                },
                "& .MuiInputLabel-root": { color: "#901b20" }
              }}
            />
            <TextField
              label="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, location: e.target.value }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#901b20" },
                  "&:hover fieldset": { borderColor: "#901b20" },
                  "&.Mui-focused fieldset": { borderColor: "#901b20" }
                },
                "& .MuiInputLabel-root": { color: "#901b20" }
              }}
            />
            <TextField
              label="Skills"
              value={filters.skills}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, skills: e.target.value }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#901b20" },
                  "&:hover fieldset": { borderColor: "#901b20" },
                  "&.Mui-focused fieldset": { borderColor: "#901b20" }
                },
                "& .MuiInputLabel-root": { color: "#901b20" }
              }}
            />
            <Button 
              type="submit" 
              variant="contained"
              style={{ backgroundColor: "#901b20", color: "white" }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleReset()}
              style={{ color: "#901b20", borderColor: "#901b20" }}
            >
              Reset
            </Button>
          </div>
        </form>
      </header>
      <div style={{ 
        display: "flex", 
        gap: "1rem", 
        flexWrap: "wrap", 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        {talents?.map((talent) => (
          <TalentCard
            key={talent.id}
            img={talent.img}
            name={talent.name}
            description={talent.about}
            style={{ border: '1px solid #901b20' }}
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
    </div>
  );
}

export default Talents;