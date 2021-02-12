import { Component } from "react";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { CarouselItem } from "./CarouselItem";
import gif from "./img/helicopter.gif";
import { CityAnimationProject } from "./Projects/CityAnimationProject";

export default class Carousel extends Component<{}, { nav1: any; nav2: any }> {
  private slider1: any;
  private slider2: any;

  constructor(props) {
    super(props);
    this.state = {
      nav1: {},
      nav2: {},
    };
  }

  public componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2,
    });
  }

  public render() {
    return (
      <div>
        <h2>Slider Syncing (AsNavFor)</h2>
        <h4>First Slider</h4>
        <Slider
          asNavFor={this.state.nav2}
          ref={(slider) => (this.slider1 = slider)}
        >
          <CityAnimationProject />
          <div>
            <h3>2</h3>
          </div>
          <div>
            <h3>3</h3>
          </div>
          <div>
            <h3>4</h3>
          </div>
          <div>
            <h3>5</h3>
          </div>
          <div>
            <h3>6</h3>
          </div>
        </Slider>
        <h4>Second Slider</h4>
        <Slider
          asNavFor={this.state.nav1}
          ref={(slider) => (this.slider2 = slider)}
          slidesToShow={6}
          swipeToSlide={true}
          focusOnSelect={true}
        >
          <CarouselItem src={gif} />
          <CarouselItem src={gif} />
          <CarouselItem src={gif} />
          <CarouselItem src={gif} />
          <CarouselItem src={gif} />
          <CarouselItem src={gif} />
        </Slider>
      </div>
    );
  }
}
