import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Components
import {Link} from 'react-router';
import LazyImage from '../image/LazyImage';
// Styles
import styles from './image_and_text_slider.css';


export default class ImageAndTextSlider extends PureComponent {
    static propTypes = {
        themeColor: PropTypes.string,
        slides: PropTypes.arrayOf(PropTypes.shape({
            imageUrl: PropTypes.string.isRequired,
            category: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired
        }))
    };

    static defaultProps = {
        themeColor: '#75bca8',
        slides: []
    };
        slideWidth(){
          return document.querySelector('.' + (styles.grid)).clientWidth -32
        }

    //added constructor to for binding
    constructor(){
        super();
        this.nextSlide = this.nextSlide.bind(this);
        this.previousSlide = this.previousSlide.bind(this);
        this.state = {currentIndex: 0, translateValue: 0};
    };

    nextSlide() {
        let slides = this.props.slides;
        if (this.state.currentIndex < slides.length - 1) {
            this.setState({ currentIndex: this.state.currentIndex + 1,
                //trigger animation
                translateValue: this.state.translateValue - this.slideWidth()});
        }
        else {
            this.setState({ currentIndex: slides.length - 1})
        }
    };

    previousSlide() {
        let slides = this.props.slides;
        if (this.state.currentIndex > 0) {
            this.setState({ currentIndex: this.state.currentIndex -1,
                //trigger animation
                translateValue: this.state.translateValue  +(this.slideWidth())})
        }
        else {
            this.setState({ currentIndex: 0})
        }
    }

    render() {
        const {
            slides,
            themeColor
        } = this.props;

        return (
            <section className={classNames(styles.container, styles.anotherContainerClass)}>
                <div className={styles.runway}>
                    <div className={styles.slide}>
                        <div className={styles.grid}>

                            <button className={[styles.navBTN, styles.leftBTN].join(' ')} onClick={this.previousSlide}> &larr;</button>
                            <div className="slider"
                                //sliding animation
                                style={{
                                        transform: `translateX(${this.state.translateValue}px)`,
                                        transition: 'transform ease-out 1s'
                                    }}>
                            {slides.map((slide, i) => (
                                <div className={styles.slideBox} key={i}>
                                    <div className={styles.slideBoxImageContainer}>
                                        <LazyImage
                                            className={styles.slideBoxImage}
                                            src={slide.imageUrl} />
                                    </div>
                                    <div className={styles.slideBoxContent}>
                                        <span style={{color: themeColor}} className={styles.slideCategory}>{slide.category}</span>
                                        <h3 className={styles.slideTitle}>{slide.title}</h3>
                                        <p className={styles.slideDescription}>{slide.description}</p>
                                        <Link
                                            to={slide.url}
                                            className={styles.readMore}
                                            style={{color: themeColor}}>
                                            Read more
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            </div>
                            <button className={[styles.navBTN, styles.rightBTN].join(' ')} onClick={this.nextSlide}> &rarr;</button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
