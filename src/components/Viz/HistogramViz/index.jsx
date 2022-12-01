import React, { useEffect, useRef } from 'react'
import * as d3 from "d3"
import './styles.css'

const HistogramViz = (props) => {
  const ref = useRef()
  const data = props.data
  const xAccessor = props.xAccessor
  const yAccessor = props.yAccessor

  // Dimensions
  const width = d3.max([
    props.width,
    800,
  ])
  const height = d3.max([
    props.height > 600 ? 600 : props.height,
    400,
  ])
  let dimensions = {
    width,
    height,
    margins: {
      top: 30,
      right: 100,
      bottom: 50,
      left: 10,
    }
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margins.left
    - dimensions.margins.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margins.top
    - dimensions.margins.bottom

  // Draw canvas
  const wrapper = d3.select(ref.current)
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const bounds = wrapper.selectAll("g.bounds")
    .data([null])
    .join("g")
    .attr("class", "bounds")
    .style("transform", `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`)

  // Init static elements
  bounds.append("g")
    .attr("class", "bins")
  bounds.append("line")
    .attr("class", "mean")

  useEffect(() => {
    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

    const binsGenerator = d3.bin()
      .domain(xScale.domain())
      .value(xAccessor)
      .thresholds(12)

    const bins = binsGenerator(data)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice()

    // Draw data
    const barPadding = 1

    const updateTransition = d3.transition()
      .duration(1000)
      .delay(1000)
      .ease(d3.easeCubicInOut)
    const exitTransition = d3.transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)

    let binGroups = bounds.select(".bins")
      .selectAll(".bin")
      .data(bins)

    const oldBinGroups = binGroups.exit()
    oldBinGroups.selectAll("rect")
      .style("fill", "red")
      .transition(exitTransition)
      .attr("height", 0)
      .attr("y", d => dimensions.boundedHeight)
    oldBinGroups.selectAll("text")
      .transition(exitTransition)
      .attr("y", dimensions.boundedHeight)
    oldBinGroups.transition(exitTransition)
      .remove()

    const newBinGroups = binGroups.enter().append("g")
      .attr("class", "bin")

    newBinGroups.append("rect")
      .attr("x", d => xScale(d.x0) + barPadding)
      .attr("y", d => dimensions.boundedHeight)
      .attr("width", d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
      .attr("height", 0)
      .style("fill", "yellowgreen")
    newBinGroups.append("text")
      .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", dimensions.boundedHeight)


    binGroups = newBinGroups.merge(binGroups) // update binGroups to include new points

    const barRects = binGroups.select("rect")
      .transition(updateTransition)
      .attr("x", d => xScale(d.x0) + barPadding)
      .attr("y", d => yScale(yAccessor(d)))
      .attr("width", d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
      .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
      .transition()
      .style("fill", "cornflowerblue")

    const barText = binGroups.select("text")
      .transition(updateTransition)
      .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", d => yScale(yAccessor(d)) - 5)
      .text(yAccessor)

    const mean = d3.mean(data, xAccessor)
    const meanLine = bounds.selectAll("line.mean")
      .data([null])
      .join("line")
      .attr("class", "mean")
      .transition(updateTransition)
      .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -15)
      .attr("y2", dimensions.boundedHeight)

    const meanLabel = bounds.selectAll("text.mean-label")
      .data([null])
      .join("text")
      .attr("class", "mean-label")
      .transition(updateTransition)
      .attr("x", xScale(mean))
      .attr("y", -20)
      .text("mean")

    // Draw peripherals
    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)

    const xAxis = bounds.selectAll("g.x-axis")
      .data([null])
      .join("g")
      .attr("class", "x-axis")
      .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

    const xAxisLabel = xAxis.selectAll("text.x-axis-label")
      .data([null])
      .join("text")
      .attr("class", "x-axis-label")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margins.bottom - 10)
      .text(props.xAxisLabel)

  }, [props])

  return <svg ref={ref} />
};

export default HistogramViz