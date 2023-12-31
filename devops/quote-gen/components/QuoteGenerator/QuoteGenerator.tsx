import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { animation } from '../Animations/HomeBg';

export const GradientBackgroundComp = styled.div`
  background: linear-gradient(to right, #000046, #1CB5E0);
  background-size: 400% 400%;
  animation: ${animation} 6s ease infinite;
  height: 100vh;
  width: 100vw;
`;