function Footer() {
  return (
    <footer
      className="footer"
      style={{
        width: "100%",
        textAlign: "center",
        padding: "20px",
        marginTop: "50px",
        backgroundColor: "#f8f9fa",
      }}
    >
      

      <div className="links" style={{ display: "flex", gap: "20px", justifyContent: "center", alignItems:'center', marginTop: "20px" }}>
      <a
        href="https://www.iti.gov.eg/"
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
      
      <p>© 2025 ITI. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
