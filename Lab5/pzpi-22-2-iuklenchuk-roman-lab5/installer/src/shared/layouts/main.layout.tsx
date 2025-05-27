import React from 'react'
import styled from 'styled-components'

interface MainLayoutProps {
  children: React.ReactNode
  mainStyle?: React.CSSProperties
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, mainStyle }) => {
  return (
    <Container>
      <Main style={mainStyle}>{children}</Main>
    </Container>
  )
}

export default MainLayout

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: #f5f5f5;
`
