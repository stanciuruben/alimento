import {
    type Dispatch,
    type SetStateAction,
    type FC, useEffect, useState
} from 'react';
import type MoreOptions from '../../types/MoreOptions';
import './MealPlans.css'

interface Props {
    setDiet: Dispatch<SetStateAction<string>>
    setAllergens: Dispatch<SetStateAction<string[]>>
    setMoreOptions: Dispatch<SetStateAction<MoreOptions>>
    setMealPlan: Dispatch<SetStateAction<string>>
    setMealPlanTitle: Dispatch<SetStateAction<string>>
}

interface MealPlansInterface extends MoreOptions {
    diet: string
    allergens: string
    date: string
    text: string
}

const MealPlans: FC<Props> = ({ setDiet, setAllergens, setMoreOptions, setMealPlan, setMealPlanTitle }) => {
    const [userPlans, setUserPlans] = useState<MealPlansInterface[]>([]);

    const fetchMealPlans = async (): Promise<void> => {
        await fetch('http://localhost:9999/mealplan/getall', {
            method: 'GET',
            credentials: 'include'
        }
        ).then(
            async res => await res.json()
        ).then(
            data => {
                if (data.message !== undefined) {
                    setUserPlans([]);
                    return;
                }
                setUserPlans(data);
            }
        ).catch(err => {
            console.error(err.message);
        });
    }

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetchMealPlans();
    }, [])

    const setCurrentMealPlan = (mealPlan: MealPlansInterface): void => {
        setDiet(mealPlan.diet);
        setAllergens(mealPlan.allergens.length > 0 ? mealPlan.allergens.split(', ') : []);
        setMoreOptions({
            kcal: mealPlan.kcal,
            protein: mealPlan.protein,
            carbs: mealPlan.carbs,
            fat: mealPlan.fat,
            useMacros: !!mealPlan.useMacros
        });
        setMealPlanTitle(mealPlan.date);
        setMealPlan(mealPlan.text);
    }

    return (
        <ul className='meal_list'>
            <h2 className='meal_list__title' >Generated Plans:</h2>
            {userPlans.length > 0
                ? userPlans.map((mealPlan, index) =>
                    <li key={mealPlan.date + index.toString()} className='meal_list__item' >
                        <button onClick={() => { setCurrentMealPlan(mealPlan) }} >{mealPlan.date}</button>
                    </li>
                )
                : <li className='meal_list__item'>
                    <span>No plans found</span>
                </li>
            }
        </ul>
    )
}

export default MealPlans
