import { useContext } from "react";
import { userContext } from "../../context/UserContext";

function Footer() {
  const {isLight} = useContext(userContext)
  return (
    <footer
      className="footer"
      style={{
        width: "100%",
        textAlign: "center",
        padding: "20px",
        backgroundColor: isLight ? "#f8f9fa" : 'black',
      }}
    >
      

      <div className="links" style={{ display: "flex", gap: "20px", justifyContent: "center", alignItems:'center', marginTop: "20px" }}>
      <a
        href="https://iti.gov.eg/home"
        target="_blank"
        rel="noopener noreferrer"
        style={{
            textDecoration: "none",
            color: "black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            }}
      >
        <img src="https://iti.gov.eg/assets/images/ColoredLogo.svg" width={300} style={{objectFit:'contain', maxWidth:'40vw'}}></img>
        <p>Official Website</p>
      </a>
      <a
        href="https://www.maharatech.gov.eg/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
            textDecoration: "none",
            color: "black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            }}
      >
        <img  src="https://maharatech.gov.eg/theme/edumy/pix/home/maharaAR.png" width={300} style={{objectFit:'contain', maxWidth:'40vw'}}></img>
        <p>Courses Platform</p>
      </a>
      </div>
      
      <p style={{color: isLight ? 'black' : 'white'}}>© 2025 ITI. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
