import React, { useState, useEffect, useCallback } from 'react';
// import { VictoryPie } from 'victory';
import { ResponsiveContainer, PieChart, Pie, Sector, Cell } from "recharts";
// import { getDatabase, ref, onValue } from "firebase/database";
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '../../config/Firebase';


function Spending(props) {
    // const [ user ] = useAuthState(auth);

    // move activeIndex to modal so onclick we can make that categories accordion expand and 
    // make the category get selected

    const onMouseOver = useCallback((data, index) => {
      // console.log(index);
      // setActiveIndex(index);
      props.toSetCurrentCategory(index);
    }, []);

    const onMouseLeave = useCallback((data, index) => {
      // setActiveIndex(null);
      props.toSetCurrentCategory(null);
    }, []);

    let colors = ['#fcba03', '#ec03fc', '#fc6f03', '#03befc', '#52fc03', '#3503fc'  ];

    const renderActiveShape = props => {
      // console.log(props);
      const RADIAN = Math.PI / 180;
      const {
        cx,
        cy,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        midAngle
      } = props;
      const sin = Math.sin(-RADIAN * midAngle);
      const cos = Math.cos(-RADIAN * midAngle);
      const sx = cx + (outerRadius - 85) * cos;
      const sy = cy + (outerRadius - 85) * sin;
      return (
        <Sector
          cx={sx}
          cy={sy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={props.payload.fill}
        />
      );
    };

    return (
        <figure className="xl:w-10/12 xl:h-4/5 xl:m-auto">
           <ResponsiveContainer width="100%" height={250}>
            <PieChart height={250}>
              <Pie
                activeIndex={props.currentCategory}
                data={props.formattedTransactions}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                stroke= "#2e2270"
                outerRadius={100}
                activeShape={renderActiveShape}
                onMouseOver={onMouseOver}
                onMouseLeave={onMouseLeave}
              >
              {props.formattedTransactions.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </figure>
    );
}

export default Spending;