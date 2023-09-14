import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Label } from 'recharts';

function AnalyticsGraph(props) {
  const [ graphDataPoints , setGraphDataPoints ] = useState([]);
  const [ graphCategories, setGraphCategories ] = useState([]);


  useEffect(() => {
    const createDataPoints = (transactions) => {
      if(transactions !== undefined && Object.keys(transactions).length){
        let dataPoints = [];
        let biggestAmount = 0;
        const uniqueDates = [...new Set(Object.values(transactions).map(item => item.date))];
        const uniqueCategories = [...new Set(Object.values(transactions).map(item => item.category))];
        let newCategories = uniqueCategories.filter((category) => {
          if(category !== 'Money In' && category !== 'Transfer' && category !== 'Credit Card Payment'){
            return category;
          } else {
            return false;
          }
        });
        setGraphCategories(newCategories);
        // need to filter out money In, cc payment, & transfer
        // order dataPoints by date
        // need unique categories to make lines for rendering graph & buttons to enable or disable those lines

        uniqueDates.forEach((date) => {
            let emptyObj = { 'date': date };
            Object.values(transactions).forEach((transaction) => {
                if(transaction.date === date){
                    if((Object.keys(emptyObj).includes(transaction.category)) && transaction.category !== 'Money In' && transaction.category !== 'Transfer'  && transaction.category !== 'Credit Card Payment'){
                        emptyObj[transaction.category] += parseFloat(transaction.value);
                    } else if( transaction.category !== 'Money In' && transaction.category !== 'Transfer'  && transaction.category !== 'Credit Card Payment' ){
                        emptyObj[transaction.category] = parseFloat(transaction.value);
                    }
                }
            })
            if(Object.keys(emptyObj).length > 1){
              dataPoints.push(emptyObj);
          }
        })

        if(dataPoints.length){
          dataPoints.forEach((point) => {
            Object.values(point).forEach((value, index) => {
              if(biggestAmount < value && index !== 0){
                biggestAmount = value;
              }
            });
          })
          dataPoints[0].amount = biggestAmount;
        }
        

        let sortedPoints = [];
        while(dataPoints.length){
            let currentSmallestIndex = 0;
            for(let i = 0; i <= dataPoints.length -1; i++){
                if(parseInt(dataPoints[i].date) < parseInt(dataPoints[currentSmallestIndex].date)){
                    currentSmallestIndex = i;
                }
            }
            sortedPoints.push(dataPoints.splice(currentSmallestIndex, 1));
        }

        // console.log(sortedPoints.flat());
      
        setGraphDataPoints(sortedPoints.flat());
      }

    };
    createDataPoints(props.transactions);
  }, [props.transactions]); // eslint-disable-line

  let colors = ['#fcba03', '#ec03fc', '#fc6f03', '#03befc', '#52fc03', '#3503fc'];

  return (
    <div className="w-full h-[20rem] flex flex-col gap-1 pt-2 xl:max-h-full">
      {/* <div className="flex items-center gap-5"> */}
        <h3 className="text-indigo-900 dark:text-indigo-300 text-xl xl:hidden">Trends</h3>
        {/* <h4 className="text-indigo-900 dark:text-indigo-300 text-sm xl:hidden">Amount spent on days of the month</h4> */}
      {/* </div> */}
      
      {/* {console.log(props.transactions)} */}
      {props.transactions === undefined ?
        <div className="text-indigo-900 dark:text-indigo-300 text-center py-4">Add Transactions to see your Trends chart</div>  
      :
        <div className="w-full h-full">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart width="100%" height="100%" data={graphDataPoints}
              margin={{top: 10, right: 10, left: 20, bottom: 20}}>
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis dataKey="date" type='number' height={25} tickCount="6" ticks={[5, 10, 15, 20, 25, 30]}>
                  <Label
                    style={{
                      textAnchor: "middle",
                      fontSize: "100%",
                      fill: "grey",
                      paddingBottom: '10px',
                    }}
                    position='bottom'
                    value={"Day of month"}
                  />
                </XAxis>
                <YAxis dataKey="amount" width={55}>
                  <Label 
                  style={{
                    textAnchor: "middle",
                    fontSize: "100%",
                    fill: "grey",
                    paddingBottom: '10px',
                  }}
                  position='left'
                  angle={270} 
                  value={"Amount ($)"}/>
                </YAxis>
                <Tooltip />
                <Legend />
                {/* use same colors as spending chart? */}
                {graphCategories.map((category, index) => {
                  return(
                    <Line type="monotone" 
                    dataKey={category} 
                    stroke={`${colors[index]}`} 
                    key={index} 
                    strokeWidth={3}
                    activeDot
                    connectNulls 
                    legendType={'none'}/>
                  )
                })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      }
    </div>
  );
}

export default AnalyticsGraph;