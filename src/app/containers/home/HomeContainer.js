import React, { PureComponent } from 'react';
// Components
import Helmet from 'react-helmet';
import ImageAndTextSlider from '../../components/image_and_text_slider/ImageAndTextSlider';
// Styles
import styles from './home_container.css';

const SLIDES = [
    {
        category: 'Cases',
        title: 'How likely do you think your clients will recommend your business to a friend or colleague in the following months?',
        description: 'Your frontline employees have a unique tacit knowledge based on their day-to-day work, interactions with clients, talks with colleagues over lunch, etc. By asking the correct questions, when this tacit knowledge is aggregated across a selected crowd and run through Mindpool’s…',
        imageUrl: 'https://c4.wallpaperflare.com/wallpaper/258/3/707/dust-smoke-colorful-men-wallpaper-preview.jpg',
        url: '/solution'
    },
    {
        category: 'Cases',
        title: 'How likely do you think your clients will recommend your business to a friend or colleague in the following months?',
        description: 'Your frontline employees have a unique tacit knowledge based on their day-to-day work, interactions with clients, talks with colleagues over lunch, etc. By asking the correct questions, when this tacit knowledge is aggregated across a selected crowd and run through Mindpool’s…',
        imageUrl: 'https://c4.wallpaperflare.com/wallpaper/258/3/707/dust-smoke-colorful-men-wallpaper-preview.jpg',
        url: '/solution'
    },
    {
        category: 'Cases',
        title: 'How likely do you think your clients will recommend your business to a friend or colleague in the following months?',
        description: 'Your frontline employees have a unique tacit knowledge based on their day-to-day work, interactions with clients, talks with colleagues over lunch, etc. By asking the correct questions, when this tacit knowledge is aggregated across a selected crowd and run through Mindpool’s…',
        imageUrl: 'https://c4.wallpaperflare.com/wallpaper/258/3/707/dust-smoke-colorful-men-wallpaper-preview.jpg',
        url: '/solution'
    },
    {
        category: 'Cases',
        title: 'How likely do you think your clients will recommend your business to a friend or colleague in the following months?',
        description: 'Your frontline employees have a unique tacit knowledge based on their day-to-day work, interactions with clients, talks with colleagues over lunch, etc. By asking the correct questions, when this tacit knowledge is aggregated across a selected crowd and run through Mindpool’s…',
        imageUrl: 'https://c4.wallpaperflare.com/wallpaper/258/3/707/dust-smoke-colorful-men-wallpaper-preview.jpg',
        url: '/solution'
    },
    {
        category: 'Cases',
        title: 'How likely do you think your clients will recommend your business to a friend or colleague in the following months?',
        description: 'Your frontline employees have a unique tacit knowledge based on their day-to-day work, interactions with clients, talks with colleagues over lunch, etc. By asking the correct questions, when this tacit knowledge is aggregated across a selected crowd and run through Mindpool’s…',
        imageUrl: 'https://c4.wallpaperflare.com/wallpaper/258/3/707/dust-smoke-colorful-men-wallpaper-preview.jpg',
        url: '/solution'
    }
];

export default class HomeContainer extends PureComponent {
    render() {
        return (
            <div className={styles.container}>
                <Helmet titleTemplate="%s" />
                <div className={styles.grid}>
                    <ImageAndTextSlider slides={SLIDES}/>
                </div>
            </div>
        );
    }
}