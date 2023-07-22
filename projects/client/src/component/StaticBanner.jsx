import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/style.css'
import banner1 from '../assets/images/banner1.jpg'
import banner2 from '../assets/images/banner2.jpg'
import banner3 from '../assets/images/banner3.jpg'
import banner4 from '../assets/images/banner4.jpg'

export default function Carousel() {
    const cards = [banner1, banner2, banner3, banner4];
   
    const settings = {
     dots: true,
     infinite: true,
     autoplay: true,
     speed: 500,
     autoplaySpeed: 5000,
     slidesToShow: 1,
     slidesToScroll: 1
    };
   
    return (
        <>
            <div>
                    <Slider {...settings}>
                    {cards.map((url) => (
                        <div>
                            <img src={url}></img>
                        </div>
                    ))}
                </Slider>
                
            </div>
        </>
    );
   }