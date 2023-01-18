import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"
import { accessorPropsType } from "./utils";
import Texts from "./Texts"
import { useTheme } from '@mui/material/styles';

const Arcs = ({ type, data, keyAccessor, radius, radiusAdjust, ...props }) => {

  const theme = useTheme();
  
  if (type === "pie") {
    radiusAdjust = 0
  }

  const arc = d3.arc()
    .innerRadius(radius * radiusAdjust)
    .outerRadius(radius)

  return (
    <React.Fragment>
      {data.map((d, i) => (
        <path {...props}
          key={keyAccessor(d, i)}
          className={`Arc Arc--type-${type}`}
          d={arc(d)}
        />
      ))}
      <Texts
        anchor="center"
        data={data}
        keyAccessor={keyAccessor}
        xAccessor={d => (arc.centroid(d)[0])}
        yAccessor={d => (arc.centroid(d)[1])}
        textAccessor={d => d.data[1].length}
        style={{fill: theme.palette.background.secondary}}
      />
    </React.Fragment>
  )
}

Arcs.propTypes = {
  type: PropTypes.oneOf(["pie", "donut"]),
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  radius: accessorPropsType,
  radiusAdjust: accessorPropsType,
}

Arcs.defaultProps = {
  radiusAdjust: 0.7,
}

export default Arcs