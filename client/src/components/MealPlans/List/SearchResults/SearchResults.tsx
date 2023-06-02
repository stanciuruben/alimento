import { type Dispatch, type SetStateAction, type FC, useMemo, useState, useEffect } from 'react';

import type MealPlan from '../../../../types/MealPlan';
import type MealPlanSearch from '../../../../types/MealPlanSearch';
import type MealPlanViewAction from '../../../../types/MealPlanViewAction';
import capitalizeString from '../../../../lib/utils/capitalizeString';

const SearchResults: FC<{
    setShowSearchResults: Dispatch<SetStateAction<boolean>>
    searchQuery: string
    setSearchQuery: Dispatch<SetStateAction<string>>
    mealPlans: MealPlan[]
    selectedPlanId: number
    updateSelectedPlan: (id: number) => void
    setMealPlansView: Dispatch<MealPlanViewAction>
}> = ({
    setShowSearchResults,
    searchQuery,
    setSearchQuery,
    mealPlans,
    selectedPlanId,
    updateSelectedPlan,
    setMealPlansView
}) => {
        const [isLoading, setLoading] = useState<boolean>(true);
        const [matches, setMatches] = useState<number>(0);
        const mealPlansCopy = useMemo<MealPlan[]>(() => mealPlans, [mealPlans]);
        const textToSearch = useMemo<string>(() => searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), [searchQuery]);
        const pattern = useMemo<RegExp>(() => new RegExp(`${textToSearch}`, 'gi'), [textToSearch]);

        const [searchResults, setSearchResults] = useState<MealPlanSearch[]>([]);

        useEffect(() => {
            let matches: number = 0;
            const SearchResults: MealPlanSearch[] = [];
            mealPlansCopy.forEach(plan => {
                let patternFound: boolean = false;

                const name: string = plan.name.replace(pattern, (match) => {
                    patternFound = true;
                    matches++;
                    return `<mark class='bg-warning p-0' >${match}</mark>`
                });

                const allergens: string = plan.allergens.length > 0
                    ? plan.allergens.join(',').replace(pattern, (match) => {
                        patternFound = true;
                        matches++;
                        return `<mark class='bg-warning p-0' >${match}</mark>`
                    })
                    : '(none)';

                const text: string = plan.text.replace(pattern, (match) => {
                    patternFound = true;
                    matches++;
                    return `<mark class='bg-warning p-0' >${match}</mark>`
                });

                if (patternFound) {
                    SearchResults.push({ ...plan, name, text, allergens });
                }
            });

            setLoading(false);
            setMatches(matches);
            setSearchResults(SearchResults);
        }, []);

        return (
            <div className='d-flex flex-column px-3'>
                <div className='d-flex flex-grow align-items-center gap-3 my-3'>
                    <button
                        className='btn btn-secondary'
                        onClick={() => {
                            setSearchQuery('');
                            setShowSearchResults(false);
                        }}
                    >
                        Back to List
                    </button>
                    <p className='m-0'>
                        {matches.toString() + (matches === 1 ? ' Result' : ' Results')} for "{searchQuery}"
                    </p>
                </div>
                {
                    isLoading
                        ? <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        : searchResults.map((plan, index) =>
                            <div key={'search-result-' + index.toString() + plan.id.toString()} className="card-body bg-light row gap-3 border my-3 rounded">
                                <div className="col-lg-3">
                                    <h3 className='card-title mb-3 d-flex gap-3 align-items-center' dangerouslySetInnerHTML={{ __html: capitalizeString(plan.name) }}></h3>
                                    <ul className='list-unstyled'>
                                        <li><b>Diet:</b> {capitalizeString(plan.diet)}</li>
                                        <li><b>Kcal:</b> {plan.protein * 4 + plan.carbs * 4 + plan.fat * 9}</li>
                                        <li><b>Protein:</b> {plan.protein}g</li>
                                        <li><b>Carbs:</b> {plan.carbs}g</li>
                                        <li><b>Fat:</b> {plan.fat}g</li>
                                        <li><b>Allergens:</b> {plan.allergens}</li>
                                    </ul>
                                    <div className='d-flex gap-3 flex-column'>
                                        <button
                                            type='button'
                                            className='btn btn-outline-success m-0'
                                            onClick={() => { updateSelectedPlan(plan.id); }}
                                            disabled={plan.id === selectedPlanId}
                                        >
                                            {plan.id !== selectedPlanId ? 'Select for today' : 'Selected'}
                                        </button>
                                        <button
                                            type='button'
                                            className='btn btn-primary m-0'
                                            onClick={() => {
                                                setMealPlansView({
                                                    type: 'SHOW_MEALPLAN',
                                                    payload: {
                                                        type: 'single',
                                                        id: plan.id,
                                                        name: plan.name,
                                                        text: plan.text,
                                                        options: {
                                                            diet: plan.diet,
                                                            protein: plan.protein,
                                                            carbs: plan.carbs,
                                                            allergens: plan.allergens !== '(none)' ? plan.allergens.split(',') : [],
                                                            fat: plan.fat
                                                        }
                                                    }
                                                })
                                            }}
                                        >
                                            View Plan
                                        </button>
                                    </div>
                                </div>
                                <div className="col">
                                    <p>
                                        {
                                            plan.text.replace(/^\s+/, '').split('\n').map((line, idx) => {
                                                return (
                                                    <span key={'line-' + idx.toString()} dangerouslySetInnerHTML={{ __html: line + '<br />' }}></span>
                                                )
                                            })
                                        }
                                    </p>
                                </div>
                            </div>
                        )
                }
            </div>
        );
    }

export default SearchResults;
