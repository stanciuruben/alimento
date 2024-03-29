import { useReducer, useState } from 'react';
import { useQuery } from 'react-query';
import './App.css';

import mainViewReducer from './reducers/mainView';
import MealPlanRequest from './lib/requests/MealPlan';
import SelectedPlanRequest from './lib/requests/SelectedPlan';
import type ErrorModalType from './types/ErrorModal';
import urls from './lib/urls.json'

import Navbar from './components/Navbar/Navbar';
import MealPlansView from './views/Mealplans/MealplansView';
import AccountView from './views/Account/AccountView';
import ErrorModal from './components/ErrorModal/ErrorModal';
import HelpModal from './components/HelpModal/HelpModal';
import StatisticsView from './views/Statistics/StatisticsView';

function App (): JSX.Element {
    const [error, setError] = useState<ErrorModalType | null>(null)
    const [mainView, setMainView] = useReducer(mainViewReducer, { current: 'mealplans', previous: 'mealplans' });
    const mealPlansQuery = useQuery({
        queryKey: ['mealplans'],
        queryFn: new MealPlanRequest().get,
        retry: () => false,
        onError: (err: any): void => {
            if (err.response?.status !== undefined && err.response.status === 401) {
                setError({
                    title: 'Unauthenticated',
                    text: 'Your session has expired, please login to continue using the app',
                    children: <>
                        <a className='btn btn-secondary' href={import.meta.env.DEV ? urls.DEV.LOGIN : urls.PROD.LOGIN}>Log-in</a>
                        <a className='btn' href={import.meta.env.DEV ? urls.DEV.REGISTER : urls.PROD.REGISTER}>Register</a>
                    </>
                });
                return;
            }
            setError({
                title: 'Something went wrong',
                text: err.message as string + '. If after a page reload the error persists contact support!',
                children: <button
                    type='button'
                    onClick={() => { setError(null); }}
                    className='btn btn-secondary'>
                    Close
                </button>
            })
        }
    })

    const selectedPlansQuery = useQuery({
        queryKey: ['selected'],
        queryFn: new SelectedPlanRequest().get,
        retry: () => false,
        onError: (err: any): void => {
            if (err.response?.status !== undefined && err.response.status === 401) {
                setError({
                    title: 'Unauthenticated',
                    text: 'Your session has expired, please login to continue using the app',
                    children: <>
                        <a className='btn btn-secondary' href={import.meta.env.DEV ? urls.DEV.LOGIN : urls.PROD.LOGIN}>Log-in</a>
                        <a className='btn' href={import.meta.env.DEV ? urls.DEV.REGISTER : urls.PROD.REGISTER}>Register</a>
                    </>
                });
                return;
            }
            setError({
                title: 'Something went wrong',
                text: err.message as string + '. If after a page reload the error persists contact support!',
                children: <button
                    type='button'
                    onClick={() => { setError(null); }}
                    className='btn btn-secondary'>
                    Close
                </button>
            })
        }
    })

    return (
        <main>
            <Navbar mainView={mainView} setMainView={setMainView} />
            <div className="min-vh-100">
                {
                    (() => {
                        switch (mainView.current) {
                            case 'mealplans':
                                return <MealPlansView
                                    mealPlans={mealPlansQuery.data}
                                    mealPlansReqStatus={mealPlansQuery.status}
                                    selectedPlans={selectedPlansQuery.data}
                                    selectedPlansReqStatus={selectedPlansQuery.status}
                                />
                            case 'account':
                                return <AccountView
                                    mealPlans={mealPlansQuery.data}
                                    mealPlansReqStatus={mealPlansQuery.status}
                                    selectedPlans={selectedPlansQuery.data}
                                    selectedPlansReqStatus={selectedPlansQuery.status}
                                />
                            case 'statistics':
                                return <StatisticsView
                                    mealPlans={mealPlansQuery.data}
                                    mealPlansReqStatus={mealPlansQuery.status}
                                    selectedPlans={selectedPlansQuery.data}
                                    selectedPlansReqStatus={selectedPlansQuery.status}
                                />
                            default:
                                return null;
                        }
                    })()
                }
            </div>
            {
                error !== null && <ErrorModal
                    title={error.title}
                    text={error.text}
                    children={(error.children !== undefined) ? error.children : null}
                />
            }
            <footer className='py-5 bg-dark'>
                <div className='text-center text-white p-3'>
                    ©{new Date().getFullYear()} Alimento by Ruben Stanciu, all rights reserved.
                </div>
            </footer>
            <HelpModal />
        </main>
    )
}

export default App;
