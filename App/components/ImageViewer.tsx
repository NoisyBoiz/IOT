import { Image, ImageProps } from 'expo-image';
import React from 'react';

interface IImageViewer extends ImageProps {}

const ImageViewer: React.FC<IImageViewer> = props => {
  return <Image {...props} />;
};

export default ImageViewer;
