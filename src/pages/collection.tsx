import { useState, useEffect } from "react";
import useNfts, { Token } from "../hooks/useNfts";
import styled from "styled-components";

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 10px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const Image = styled.img`
  width: 100%;
  height: auto;
`;

export default function Collection() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    let imageUrls = [];

    for (let i = 1; i <= 50; i++) {
      const imageUrl = `https://bafybeihocfptf5aemeo3iuk6hi6ibccbfjemco4xuwzs7sexxqjpssolee.ipfs.nftstorage.link/WiB-Avatar-${i}.png`;
      imageUrls.push(imageUrl);
    }

    setImages(imageUrls as any);
  }, []);
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {images.map((imageUrl, idx) => (
        <img
          key={idx}
          src={imageUrl}
          className="w-full h-auto"
          alt={`xyz${idx + 1}`}
        />
      ))}
    </div>
  );
}
