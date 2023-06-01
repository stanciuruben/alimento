import { useReducer, useState } from 'react';
import { useQuery } from 'react-query';
import './App.css';

import mainViewReducer from './reducers/mainView';
import MealPlanRequest from './lib/requests/MealPlan';
import type ErrorModalType from './types/ErrorModal';
import urls from './lib/urls.json'

import Navbar from './components/Navbar/Navbar';
import MealPlansView from './views/Mealplans/MealplansView';
import ErrorModal from './components/ErrorModal/ErrorModal';

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
                text: err.message as string + '. if after a page reload the error persists contact support!',
                children: <button
                    type='button'
                    onClick={() => { setError(null); }}
                    className='btn btn-secondary'>
                    Close
                </button>
            })
        }
    })

    return (<main>
        <Navbar mainView={mainView} setMainView={setMainView} />
        {
            (() => {
                switch (mainView.current) {
                    case 'mealplans':
                        return <MealPlansView mealPlans={mealPlansQuery.data} mealPlansReqStatus={mealPlansQuery.status} />
                    case 'statistics':
                    case 'account':
                    default:
                        return null;
                }
            })()
        }
        {
            error !== null && <ErrorModal
                title={error.title}
                text={error.text}
                children={(error.children !== undefined) ? error.children : null}
            />
        }
    </main>)
}

export default App;
