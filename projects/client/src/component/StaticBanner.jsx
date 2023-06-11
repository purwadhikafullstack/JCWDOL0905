import Slider from 'react-slick';
import { useState } from 'react';
import { Box, Center, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/style.css';

export default function Carousel() {
 const cards = [
  'https://assets.segari.id/thematic-banner/A-lii8p590.webp',
  'https://assets.segari.id/thematic-banner/B-lii8qc4t.webp',
  'https://assets.segari.id/thematic-banner/C-lii8qvs3.webp',
  'https://assets.segari.id/thematic-banner/D-lii7vrdk.webp'
 ];

 const settings = {
  // fade: true,
  dots: true,

  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1
 };

 return (
    <Center>
        <Box className="carousel" w={[300, 400, 500, 700, 900]} padding={'10px'}>
        {/* Slider */}
            <Slider {...settings}>
                {cards.map((url, index) => (
                    <Box
                    key={index}
                    className="carousel-card"
                    position="relative"
                    backgroundPosition="center"
                    backgroundRepeat="no-repeat"
                    backgroundSize="cover"
                    h={[100, 110, 150, 200, 300]}
                    backgroundImage={`url('${url}')`}
                    />
                ))}
            </Slider>
        </Box>
    </Center>
 );
}
