import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function SpendingAccordion(props) {

  const handleChange = (index) => (e, newExpanded) => {
    props.toSetCurrentCategory(newExpanded ? index : false);
    // console.log(index);
  }

  let colors = ['#fcba03', '#ec03fc', '#fc6f03', '#03befc', '#52fc03', '#3503fc'];

  return(
      props.formattedTransactions.map((value, index) => {
        return(
            <Accordion key={index} 
              expanded={props.currentCategory === index} 
              onChange={handleChange(index)}
              sx={{
                backgroundColor: 'rgb(49 46 129)',
                borderRadius: 5,
                padding: 0,
                margin: '3px',
                boxShadow: "none",
                color: '#312e81'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{
                  backgroundColor: `${colors[index]}`,
                  width:{
                    xs: '90%',
                    sm: '80%'
                  },
                  borderRadius: 2,
                  margin: 'auto',
                  display: 'flex',
                  justifyContent: 'space-between',
                  boxShadow: "none",
                  minHeight: 0,
                  height: '35px',
                  "&.Mui-expanded": {
                    minHeight: 0
                  },
                  "& .MuiAccordionSummary-content.Mui-expanded": {
                    margin: "10px 0"
                  }
                  }}
                >
                <Typography
                  sx={{
                    padding: '0px',
                    margin: '0px',
                    fontSize: '15px', 
                    fontWeight: 600,
                    flexBasis: '90%',
                  }}>
                  {value.name}
                </Typography>
                <Typography
                  sx={{
                    padding: '0px',
                    margin: '0px',
                    fontSize: '15px',
                    fontWeight: 600,
                    justifySelf: 'flex-end',
                  }}>
                  ${value.value}
                </Typography>
              </AccordionSummary>
              <AccordionDetails 
              sx={{overflowY: 'auto'}}>
                {props.allTransactions
                  .filter((transaction) => transaction.category === value.name)
                  .map((filteredTransaction, index) => {
                    return(
                      <div className="flex justify-between text-indigo-300 m-auto w-8/12 sm:w-9/12 sm:m-auto" key={index}>
                        <Typography
                          sx={{textAlign:"left", flexBasis: '50%'}}>{filteredTransaction.name}</Typography>
                        <Typography
                          sx={{textAlign:"right", flexBasis: '50%'}}>${filteredTransaction.value}</Typography>
                      </div>
                    )
                  })
                }
              </AccordionDetails>
            </Accordion>
        ); 
      })
    )
}

export default SpendingAccordion;