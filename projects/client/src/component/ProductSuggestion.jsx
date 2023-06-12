import Slider from "react-slick";
import { useState } from "react";
import { Box, Center, IconButton, useBreakpointValue, Text } from "@chakra-ui/react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/product.css";

export default function Suggested(props) {
  const cards = [
    "https://web3.21cineplex.com/mobile-banner/mtix%20pay%20App.jpg",
    "https://web3.21cineplex.com/mobile-banner/MakinDekatApps.jpg",
    "https://web3.21cineplex.com/mobile-banner/Caramel%20SachetApps.jpg",
    "https://web3.21cineplex.com/mobile-banner/mtix%20pay%20App.jpg",
    "https://web3.21cineplex.com/mobile-banner/MakinDekatApps.jpg",
    "https://web3.21cineplex.com/mobile-banner/Caramel%20SachetApps.jpg",
  ];

  const productsData = props.productsData;

  const settings = {
    // fade: true,
    dots: false,

    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 4000,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  return (
    <>
      <Center>
        <Text mt={'30px'} fontSize={'xl'} as='b'>Product Suggestion</Text>
      </Center>
      <Center>
        <Box className="carousel-product" w={[370, 600, 775, 1000, 1200]}>
          {/* Slider */}
          <Slider {...settings}>
            {productsData.map((product) => (
              <div
                key={product.id}
                className="group relative border-r border-b border-gray-200 p-4 sm:p-6"
              >
                <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                  <img
                    src={product.product_image}
                    alt={"product image"}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="pt-10 pb-4 text-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    <a href={"#"}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.product_name}
                    </a>
                  </h3>
                  <p className="mt-4 text-base font-medium text-gray-900">
                    Rp. {product.product_price}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </Box>
      </Center>
    </>
  );
}
