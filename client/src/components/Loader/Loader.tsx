import { type FC } from 'react';

const Loader: FC = () => {
    return (
        <div>
            <div
                style={{
                    width: '20rem',
                    height: 0,
                    paddingBottom: '20rem',
                    position: 'relative'
                }}
            >
                <iframe
                    src="https://giphy.com/embed/l2JHRhAtnJSDNJ2py"
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute' }}
                    frameBorder="0"
                    className="giphy-embed"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default Loader;
