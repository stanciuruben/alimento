import { useReducer } from 'react';
import './App.css';

import mainViewReducer from './reducers/mainView';

import Navbar from './components/Navbar/Navbar';
import MealPlansView from './views/Mealplans/MealplansView';

function App (): JSX.Element {
    const [mainView, setMainView] = useReducer(mainViewReducer, { current: 'mealplans', previous: 'mealplans' })

    return (<main>
        <Navbar mainView={mainView} setMainView={setMainView} />
        {
            (() => {
                switch (mainView.current) {
                    case 'mealplans':
                        return <MealPlansView />
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
