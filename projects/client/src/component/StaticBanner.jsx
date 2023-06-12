import Slider from 'react-slick';
import { useState } from 'react';
import { Box, Center, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/banner.css';
import banner1 from '../assets/images/banner1.jpg'
import banner2 from '../assets/images/banner2.jpg'
import banner3 from '../assets/images/banner3.jpg'
import banner4 from '../assets/images/banner4.jpg'

export default function Carousel() {
 const cards = [
    banner1,
    banner2,
    banner3,
    banner4
 ];

 const settings = {
  // fade: true,
  dots: true,

  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 7000,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipeToSlide: true,
 };

 return (
    <Center>
        <Box className="carousel" w={[350, 570, 755, 980, 1180]} padding={'10px'}>
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
                    h={[150, 180, 200, 270, 320]}
                    backgroundImage={`url('${url}')`}
                    />
                ))}
            </Slider>
        </Box>
    </Center>
 );
}
