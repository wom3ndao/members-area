import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import styled from "styled-components";

import LoadingSpinner from "components/LoadingSpinner";
import PageLayout from "components/PageLayout";

import PlaceholderImage from "../../images/placeholder.png";
import { Button } from "@q-dev/q-ui-kit";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 4px;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Caption = styled.div`
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.09);
  color: #000;
  padding: 8px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  font-size: 14px;
  margin-top: -6px;
`;

const ImageContainer = styled.div`
  margin-top: 16px;
`;

const Collection = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [visibleImages, setVisibleImages] = useState(10);

  useEffect(() => {
    const imageUrls = [];

    for (let i = 1; i <= 50; i++) {
      const imageUrl = `https://bafybeihocfptf5aemeo3iuk6hi6ibccbfjemco4xuwzs7sexxqjpssolee.ipfs.nftstorage.link/WiB-Avatar-${i}.png`;
      imageUrls.push(imageUrl);
    }

    setImages(imageUrls as any);
    setLoading(false);
  }, []);

  const handleShowMore = () => {
    setVisibleImages((prevVisibleImages) => prevVisibleImages + 10);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <PageLayout title={"Collection"}>
      <div>
        <p className="text-md color-secondary">wom3n.DAO NFT Season #1</p>
        <div className="balance-overview__params-value-wrapper">
          <p className="text-xl font-semibold">View our 50 pieces NFT collection</p>
        </div>
      </div>
      <Grid>
        {images.slice(0, visibleImages).map((imageUrl, idx) => (
          <ImageContainer key={idx}>
            <LazyLoadImage
              key={idx}
              placeholderSrc={PlaceholderImage}
              effect="blur"
              style={{
                marginTop: "-2px",
                // border: "2px solid #ccc",
                // borderRadius: "8px",
                // padding: "5px",
              }}
              width="100%"
              height="auto"
              src={imageUrl}
              alt={`xyz${idx + 1}`}
            />
            <Caption>No. {idx + 1}</Caption>
          </ImageContainer>
        ))}
      </Grid>
      {visibleImages < images.length && (
        <div
          style={{
            display: "grid",
            placeItems: "center",
          }}
        >
          <Button onClick={handleShowMore}>Show More</Button>
        </div>
      )}
    </PageLayout>
  );
};

export default Collection;
