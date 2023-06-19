import { useEffect, useState } from 'react';

import styled from 'styled-components';

import LoadingSpinner from 'components/LoadingSpinner';
import PageLayout from 'components/PageLayout';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 4px;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Image = styled.img`
  width: 100%;
  height: auto;
`;

function Collection () {
  const [images, setImages] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const imageUrls = [];

    for (let i = 1; i <= 50; i++) {
      const imageUrl = `https://bafybeihocfptf5aemeo3iuk6hi6ibccbfjemco4xuwzs7sexxqjpssolee.ipfs.nftstorage.link/WiB-Avatar-${i}.png`;
      imageUrls.push(imageUrl);
    }

    setImages(imageUrls as any);
    setLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <PageLayout title={'Collection'}>
      <Grid>
        {images.map((imageUrl, idx) => (
          <Image
            key={idx}
            src={imageUrl}
            alt={`xyz${idx + 1}`}
          />
        ))}
      </Grid>
    </PageLayout>
  );
}
export default Collection;
