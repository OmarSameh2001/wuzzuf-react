import { Tab, Tabs } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import '../../ComponentsStyles/process_column.css';
import'../../styles/theme.css';
import { userContext } from "../../context/UserContext";

function ProcessColumn({setter, column, phases, application}) {
  const{isLight} = useContext(userContext);
    useEffect(() => {
        if(application?.status){
            if(application.status === '1') return
            setter(parseInt(application.status)-1);
        }
    }, [application, setter]);
    return (
    <div className="process-column-container" style={{borderBottom: '1px solid var(--gray-300)'}}>
        <Tabs
          orientation="horizontal"
          value={column}
          variant="scrollable"
          scrollButtons="auto"
          className="process-tabs"
          TabIndicatorProps={{
            style: {
              backgroundColor: "#722732",
            },
          }}
          sx={{
            '.process-tab':{
              color: isLight ?'var(--gray-700)' :'red',
            }
          }}
        >
          {phases.map((phase, index) => (
            <Tab
              key={phase}
              label={phase}
              value={index + 1}
              onClick={() => setter(index + 1)}
              className={`process-tab ${index + 1 === column ? "active" : ""}`}
            />
          ))}
        </Tabs>
      </div>
 
    );
}

export default ProcessColumn;

