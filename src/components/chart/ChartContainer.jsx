import React from "react"
import PropTypes from "prop-types"

import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

import Histogram from "../Histogram"
import ScatterPlot from "../ScatterPlot"
import Timeline from "../Timeline"

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const ChartContainer = ({ onClick, chart, chosen, index, data, fields }) => {

  const theme = useTheme();

  const outOfFocus = chosen !== null && index !== chosen
  const active = index === chosen
  const xAxis = chart.xAxis
  const yAxis = chart.yAxis
  const yAxisSummarization = chart.yAxisSummarization
  const xAxisParser = fields.find(field => field.id === chart.xAxis).parser
  const yAxisParser = fields.find(field => field.id === chart.yAxis).parser
  const xAxisFormatter = fields.find(field => field.id === chart.xAxis).formatter
  const yAxisFormatter = fields.find(field => field.id === chart.yAxis).formatter

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: window.innerHeight * 0.9,
    width: window.innerHeight * 0.9,
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: `2px solid ${theme.vars.palette.primary.main}`,
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const renderChart = (zoomed) => {
    switch (chart.id) {
      case "scatter": return <ScatterPlot
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={data}
        xAxis={xAxis}
        yAxis={yAxis}
        xAxisParser={xAxisParser}
        yAxisParser={yAxisParser}
        xAxisFormatter={xAxisFormatter}
        yAxisFormatter={yAxisFormatter}
      />;
      case "histogram": return null;
      case "timeline": return null;
      default: return null;
    }
  }

  return (
    <div onClick={outOfFocus ? onClick : null} className={`Chart__container ${outOfFocus ? 'outOfFocus' : 'inFocus'}`}>
      <div className="ChartIconsContainer">
        <div className="ChartIcons">
          <IconButton onClick={onClick}>
            <SettingsIcon style={{ color: theme.vars.palette.primary.main }} />
          </IconButton>
          <IconButton onClick={handleOpen}>
            <ZoomOutMapIcon style={{ color: theme.vars.palette.primary.main }} />
          </IconButton>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="tooltipD3zoomed" className="tooltipD3">
            <div className="tooltipD3-value1">
              <span id="tooltipD3zoomed-value1"></span>
            </div>
            <div className="tooltipD3-value2">
              <span id="tooltipD3zoomed-value2"></span>
            </div>
          </div>
          {renderChart(true)}
        </Box>
      </Modal>
      {renderChart(false)}
    </div>
  )
}

export default ChartContainer