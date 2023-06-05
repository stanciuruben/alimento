import { type Dispatch, type FC } from 'react';
import './Navbar.css';

import type MainView from '../../types/MainView';
import type MainViewAction from '../../types/MainViewAction';

const Navbar: FC<{
    mainView: MainView
    setMainView: Dispatch<MainViewAction>
}> = ({
    mainView,
    setMainView
}) => {
        return (
            <nav className='main-nav'>
                <div className="main-nav-container">
                    <div className="container main-nav__top">
                        <h3 className='main-nav__logo'>Aliment<span>o</span></h3>
                        <button
                            data-bs-toggle="modal"
                            data-bs-target="#help-modal"
                            className='btn btn-light'
                        >
                            Help?
                        </button>
                    </div>
                </div>
                <div className="container main-nav__bottom row">
                    <button
                        type='button'
                        onClick={() => { setMainView({ type: 'statistics', previous: mainView.current }) }}
                        className={'col main-nav__link btn b-r-bl ' + (mainView.current === 'statistics' ? 'main-nav__link--active' : '')}
                    >
                        <i className="bi bi-graph-up-arrow"></i> <span>Statistics</span>
                    </button>
                    <button
                        type='button'
                        onClick={() => { setMainView({ type: 'mealplans', previous: mainView.current }) }}
                        className={'col main-nav__link btn ' + (mainView.current === 'mealplans' ? 'main-nav__link--active' : '')}
                    >
                        <i className="bi bi-cup-straw"></i> <span>Meal Plans</span>
                    </button>
                    <button
                        type='button'
                        onClick={() => { setMainView({ type: 'account', previous: mainView.current }) }}
                        className={'col main-nav__link btn b-r-br ' + (mainView.current === 'account' ? 'main-nav__link--active' : '')}
                    >
                        <i className="bi bi-person"></i> <span>Account</span>
                    </button>
                </div>
            </nav>
        );
    }

export default Navbar;
