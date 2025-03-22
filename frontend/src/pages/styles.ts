import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #333, black);
`;

export const NoText = styled.span`
  color: white;
  margin: 10px;
  font-size: 14px;
  font-weight: 500;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background-color: #1b1b1b;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: aliceblue;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: aliceblue;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 1.5rem;
  background-color: #374151;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.2rem;
`;

export const TableWrapper = styled.div`
  overflow: auto;
  height: calc(100vh - 260px);
  margin: 0 20px;
  border: 1px solid #374151;
`;

export const OptimizedPriceWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
