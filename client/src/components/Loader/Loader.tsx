import { type FC } from 'react';
import './Loader.css';

const Loader: FC = () => {
    return (
        <div className="loader">
            <div className="loader__animation">
                <iframe
                    src="https://giphy.com/embed/l2JHRhAtnJSDNJ2py"
                    width="100%"
                    height="100%"
                    style={{
                        position: 'relative',
                        width: '20rem',
                        height: '20rem',
                        userSelect: 'none',
                        pointerEvents: 'none'
                    }}
                    frameBorder="0"
                    className="giphy-embed"
                    allowFullScreen
                ></iframe>
            </div>
            <p className="loader__text">
                Check this cool dance out while we get your custom meal plan!{' '}
                {':)'}
            </p>
        </div>
    );
};

export default Loader;
