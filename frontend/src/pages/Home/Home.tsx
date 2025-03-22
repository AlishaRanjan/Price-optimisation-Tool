import styled from 'styled-components';
import Logo from '../../assets/image/logo.jpg'
import createManageLogo from '../../assets/image/create-manage.png'
import priceOptimizationLogo from '../../assets/image/price-optimization.png'
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import withAuth from '../../ducks/auth_hoc';

const Container = styled.div`
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 36px;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  max-width: 600px;
  text-align: center;
  margin-bottom: 40px;
`;

const CardContainer = styled.div`
  display: flex;
  gap: 30px;

  & > a {
    text-decoration: none;
  }

`;

const Card = styled.div`
  background: white;
  color: #333;
  border-radius: 10px;
  padding: 20px;
  width: 330px;
  height: 450px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const Icon = styled.div`
  font-size: 50px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h2`
  font-size: 36px;
  margin: 0 0 10px 0;
`;

const CardDescription = styled.p`
  font-size: 14px;
  margin-bottom: 20px;
`;

const HeaderLogo = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
`;

const StyledImage = styled.img`
    height: 160px;
    width: 160px;
    margin-top: 60px;
`;

/**
 * Home Component
 * 
 * Description:
 * The Home component is the main landing page for the Price Optimization Tool application. It presents a
 * welcoming interface that includes a header logo, a title, a subtitle, and a series of clickable cards 
 * linking to other pages in the application, such as product creation and management, and pricing optimization.
 */

const Home = () => {
  return (
    <Container>
      <HeaderLogo><StyledImage src={Logo} alt='logo' /></HeaderLogo>
      <Title>Price Optimization Tool</Title>
      <Subtitle>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Subtitle>
      <CardContainer>
        <Link to="/create-manage-product">
          <Card>
            <Icon><img src={createManageLogo} alt="create-manage-product" /></Icon>
            <div>
              <CardTitle>Create and Manage Product</CardTitle>
              <CardDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</CardDescription>
            </div>
            <ArrowRight size={40} />
          </Card>
        </Link>
        <Link to="/page-optimization">
          <Card>
            <Icon><img src={priceOptimizationLogo} alt='page-optimization' /></Icon>
            <div>
              <CardTitle>Pricing Optimization</CardTitle>
              <CardDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</CardDescription>
            </div>
            <ArrowRight size={40} />
          </Card>
        </Link>
      </CardContainer>
    </Container>
  );
};

export default withAuth(Home);