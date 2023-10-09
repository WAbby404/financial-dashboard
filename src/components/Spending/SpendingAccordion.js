import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function SpendingAccordion(props) {

  // handles which accordion is active (or expanded)
  const handleChange = (index) => (e, newExpanded) => {
    props.toSetCurrentCategory(newExpanded ? index : false);
  }

  let colors = ['#fcba03', '#ec03fc', '#fc6f03', '#03befc', '#52fc03', '#3503fc'];

  let accordionStyles = {
    backgroundColor: props.theme === 'dark' ? 'rgb(49 46 129)' : 'rgb(248 250 252)',
    margin: '3px auto',
    borderRadius: 5,
    padding: 0,
    boxShadow: "none",
    color: '#312e81'
  }

  const formatMoney = (money) => {
    if(money){
        let formattedMoney = money.toString().split('.');
        let newMoney = [];
        if(!formattedMoney[1]){
          formattedMoney[1] = '00';
        }
        formattedMoney[1] = formattedMoney[1].slice(0, 2);
        if(formattedMoney[0].length > 3){
            let stringArray = formattedMoney[0].split('');
            while(stringArray.length){
                newMoney.push(stringArray[0]);
                stringArray.shift();
                if(stringArray.length % 3 === 0 && stringArray.length !== 0){
                    newMoney.push(',');
                }
            }
            newMoney.join('');
        } else {
          if(formattedMoney[1]){
            return formattedMoney[0] + '.' + formattedMoney[1];
          }
          return formattedMoney[0] + '.00';
        }
        if(formattedMoney[1]){
          return (newMoney.join('') + '.' + formattedMoney[1]);
        }
        return newMoney.join('') + '.00';
    }
    return '0.00';
}

  return(
      props.formattedTransactions.map((value, index) => {
        return(
            <Accordion key={index} 
              expanded={props.currentCategory === index} 
              onChange={handleChange(index)}
              sx={accordionStyles}
              data-testid="spendingAccordion"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{
                  backgroundColor: `${colors[index]}`,
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
                  data-testid={`spendingAccordionBar${index}`}
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
                  ${formatMoney(value.value)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails 
                sx={{overflowY: 'auto', margin: 'auto'}}>
                {props.allTransactions
                  .filter((transaction) => transaction.category === value.name)
                  .map((filteredTransaction, index) => {
                    return(
                      <div className="flex justify-between text-indigo-900 dark:text-indigo-300 m-auto w-8/12 sm:w-9/12 sm:m-auto" key={index}>
                        <Typography
                          data-testid={`spendingAccordionTypographyName${index}`}
                          sx={{textAlign:"left", flexBasis: '50%'}}>{filteredTransaction.name}</Typography>
                        <Typography
                          data-testid={`spendingAccordionTypographyMoney${index}`}
                          sx={{textAlign:"right", flexBasis: '50%'}}>${formatMoney(filteredTransaction.value)}</Typography>
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