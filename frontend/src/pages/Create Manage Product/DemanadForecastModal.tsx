import React from 'react';
import { CircleX } from 'lucide-react'
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { DemandForecastModalProps, ProductResponseInterface } from '../../ducks/types';



ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: #2E2E2E;
  color: #fff;
  width: 90%;
  max-width: 1000px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
  padding: 10px 20px;
  margin-bottom: 20px;
  background: #1B1B1B;
`;

const Title = styled.h2`
  font-size: 18px;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  color: #f44336;
  cursor: pointer;
`;

const ChartContainer = styled.div`
  margin: 20px;
  padding: 10px;
  height: 300px;
  background-color: #1B1B1B;
`;

const Table = styled.table`
  margin: 20px;
  font-size: 0.8rem;
  border-collapse: collapse;
  width: calc(100% - 41px);
`;

const TableHeader = styled.th`
  background: #1B1B1B;
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #444;
`;

const TableRow = styled.tr`
  color: #333;

  &:nth-child(odd) {
    background: #fff;
  }

  &:nth-child(even) {
    background: #F2F2F2;
  }

  & > td:last-child {
    font-weight: bold;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #a0a0a0;
  border-right: 1px solid #a0a0a0;
`;

const HighlightedCell = styled(TableCell)`
  background: #7AF5DD;
`;
// Container for the entire legend section
const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
`;

// Each item in the legend (color box + label)
const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0 12px;
`;

// Color box indicating the color of the line on the chart
const LegendColorBox = styled.div`
  width: 20px;
  height: 20px;
  background-color: #000; // Default color, will be overridden by inline styles
  margin-right: 8px;
  border-radius: 4px;
`;

// Label next to the color box
const LegendLabel = styled.span`
  font-size: 14px;
  color: #fff;
`;

/**
 * DemandForecastModal Component
 * 
 * Description:
 * The DemandForecastModal component is a modal that displays a demand forecast chart and a table with 
 * relevant product details. It integrates react-chartjs-2 to visualize the demand forecast data alongside 
 * the selling price for each product. The modal is designed to display the forecast data dynamically based 
 * on the provided inputs.
 */

const DemandForecastModal: React.FC<DemandForecastModalProps> = ({ demandFrorecastData, filteredList, onCloseHandler }) => {
  const commonData = filteredList?.filter((product) =>
    demandFrorecastData?.some((forecast) => forecast.product === product.id)
  );
  const data = {
    labels: commonData?.map((product) => product.name),
    datasets: [
      {
        label: 'Product Demand',
        data: commonData?.map((product) =>
          demandFrorecastData?.find((forecast) => forecast.product === product.id)?.forecast_value
        ),
        borderColor: 'purple',
        tension: 0.1,
      },
      {
        label: 'Selling Price',
        data: commonData?.map((product) => product.selling_price),
        borderColor: 'cyan',
        tension: 0.1,
      },
    ],
  };
  const legendItems = [
    { label: 'Product Demand', color: 'purple' },
    { label: 'Selling Price', color: 'cyan' },
  ];

  return (
    <ModalOverlay>
      <ModalContainer>
        <Header>
          <Title>Demand Forecast</Title>
          <CloseButton onClick={onCloseHandler}><CircleX /></CloseButton>
        </Header>
        <ChartContainer>
          <Line
            options={{
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    pointStyle: 'line', // Change to eg 'circle' or 'rect' to control legend independently of the plotted pointStyle
                    usePointStyle: true,
                  }
                }
              }
            }}
            data={data} />
        </ChartContainer>
        <LegendContainer>
          {legendItems.map((item, index) => (
            <LegendItem key={index}>
              <LegendColorBox style={{ backgroundColor: item.color }} />
              <LegendLabel>{item.label}</LegendLabel>
            </LegendItem>
          ))}
        </LegendContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Product Name</TableHeader>
              <TableHeader>Product Category</TableHeader>
              <TableHeader>Cost Price</TableHeader>
              <TableHeader>Selling Price</TableHeader>
              <TableHeader>Available Stock</TableHeader>
              <TableHeader>Units Sold</TableHeader>
              <TableHeader>Calculated Demand Forecast</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredList?.map((product: ProductResponseInterface, id: number) => {
              const forecastData = demandFrorecastData?.filter((item) => item.product === product.id)[0];
              return (
                <>{forecastData &&
                  <TableRow>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>${product.cost_price}</TableCell>
                    <TableCell>${product.selling_price}</TableCell>
                    <TableCell>{product.stock_available}</TableCell>
                    <TableCell>{product.units_sold}</TableCell>
                    <HighlightedCell>{forecastData === undefined ? '-' : forecastData?.forecast_value}</HighlightedCell>
                  </TableRow>}
                </>
              );
            })}
          </tbody>
        </Table>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default React.memo(DemandForecastModal);