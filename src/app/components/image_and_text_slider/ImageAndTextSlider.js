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

    constructor(){
        super();
        this.nextSlide = this.nextSlide.bind(this);
        this.previousSlide = this.previousSlide.bind(this);
        this
        this.state = {currentIndex: 0};
    };

    nextSlide() {
        let slides = this.props.slides;
        if (this.state.currentIndex < slides.length - 1) {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, function () {
        });
        }
        else {
            this.setState({ currentIndex: 0 })
        }
    };

    previousSlide() {
        let slides = this.props.slides;
        if (this.state.currentIndex > 0) {
            this.setState({ currentIndex: this.state.currentIndex -1 })
        }
        else {
            this.setState({ currentIndex: slides.length - 1 })
        }
    }

    render() {
        const {
            slides,
            themeColor
        } = this.props;

        let slide = slides[this.state.currentIndex];
        return (
            <section className={classNames(styles.container, styles.anotherContainerClass)}>
                <div className={styles.runway}>
                    <div className={styles.slide}>
                        <div className={styles.grid}>
                            <button className={[styles.navBTN, styles.leftBTN].join(' ')} onClick={this.previousSlide}> &larr;</button>
                            <div className={styles.slideBox}>
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
                            <button className={[styles.navBTN, styles.rightBTN].join(' ')} onClick={this.nextSlide}> &rarr;</button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
