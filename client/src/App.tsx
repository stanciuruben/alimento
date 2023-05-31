import { useReducer } from 'react';
import { useQuery } from 'react-query';
import './App.css';

import mainViewReducer from './reducers/mainView';
import MealPlanRequest from './lib/requests/MealPlan';

import Navbar from './components/Navbar/Navbar';
import MealPlansView from './views/Mealplans/MealplansView';

function App (): JSX.Element {
    const [mainView, setMainView] = useReducer(mainViewReducer, { current: 'mealplans', previous: 'mealplans' });
    const mealPlansQuery = useQuery({
        queryKey: ['mealplans'],
        queryFn: new MealPlanRequest().get
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
    </main>)
}

export default App;
