import React from 'react';
import styled from 'styled-components';

const PreceptsContainer = styled.div`
  padding: 1rem;
`;

const PreceptsTitle = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const PreceptsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PreceptItem = styled.li`
  margin-bottom: 0.5rem;
`;

const Precepts: React.FC = () => {
  return (
    <PreceptsContainer>
      <PreceptsTitle>戒律</PreceptsTitle>
      <PreceptsList>
        <PreceptItem>1. 不殺生</PreceptItem>
        <PreceptItem>2. 不偷盜</PreceptItem>
        <PreceptItem>3. 不邪淫</PreceptItem>
        <PreceptItem>4. 不妄語</PreceptItem>
        <PreceptItem>5. 不飲酒</PreceptItem>
      </PreceptsList>
    </PreceptsContainer>
  );
};

export default Precepts;
