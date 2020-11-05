import React from "react";

import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis
} from "victory";



const Bars = (props) => {
    let data = props.data
    
   console.log("got the data", data);
  return (
    <div style={props.style}>
      <VictoryChart
        responsive={false}
        animate={{
          duration: 100,
          onLoad: { duration: 1000 }
        }}
        domainPadding={{ x: 40 }}
        theme={VictoryTheme.material}
        padding={{ top: 30, bottom: 90, left: 30, right: 30 }}
      >
        <VictoryAxis 
        label={props.name}
        style={{ axisLabel: { padding: 68, margin:20 } }}
        tickLabelComponent={<VictoryLabel textAnchor="start" angle={90} />}
        />
        <VictoryBar
          barRatio={0}
          cornerRadius={2} // Having this be a non-zero number looks good when it isn't transitioning, but looks like garbage when it is....
          style={{ data: { fill: "#ff0000" } }}
          alignment="middle"
          labels={d => d.y}
          data={props.data
          }
        />
        <VictoryAxis
      dependentAxis
      label={"Frequency"}
      // axisLabelComponent={<VictoryLabel dy={20}/>}
      // fixLabelOverlap={true}
      tickFormat={y => {
        if (y>1000){
         return `${y/1000}k`
        }else{
          return y
        }
       }}

      style={{ axisLabel: { padding: 30, margin:20 } }}
      />
      </VictoryChart>
    </div>
  );
}

export default Bars;