import { useEffect, type FC, useMemo } from 'react';
import './AccountView.css';
import { useQuery } from 'react-query';

import UserRequest from '../../lib/requests/User';
import type MealPlan from '../../types/MealPlan';
import urls from '../../lib/urls.json';

const AccountView: FC<{
    mealPlans: MealPlan[]
    mealPlansReqStatus: 'error' | 'idle' | 'loading' | 'success'
    selectedPlans: Array<{ plan_id: number, date: string }>
    selectedPlansReqStatus: 'error' | 'idle' | 'loading' | 'success'
}> = ({
    mealPlans,
    mealPlansReqStatus,
    selectedPlans,
    selectedPlansReqStatus
}) => {
        const logoutURL = useMemo<string>(() => import.meta.env.DEV ? urls.DEV.LOGOUT : urls.PROD.LOGOUT, []);
        const addTooltips = (): void => {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                // @ts-expect-error bootstrap
                return new bootstrap.Tooltip(tooltipTriggerEl)
            });
        }
        const UserQuery = useQuery({
            queryFn: new UserRequest().get
        })

        useEffect(() => {
            addTooltips();
        }, []);

        return (
            <div className='container my-5'>
                {
                    (!UserQuery.isLoading && mealPlansReqStatus === 'success' && selectedPlansReqStatus === 'success')
                        ? <div className="row flex-col-reverse">
                            <div className="col-lg-6">
                                <div className='account-icon pe-none user-select-none'>
                                    {UserQuery.data?.name.slice(0, 2).toLocaleUpperCase()}
                                </div>
                            </div>
                            <div className="col-lg-6 mb-3">
                                <h1 className='mb-3 mt-3 mt-lg-0'>Account</h1>
                                <p><b>Name:</b> {UserQuery.data?.name}</p>
                                <p><b>Balance:</b> {UserQuery.data?.tokens} tokens</p>
                                <p><b>Generated Plans:</b> {mealPlans.length}</p>
                                <p><b>App usage:</b> {selectedPlans.length} days</p>
                                <div className="mt-4">
                                    <button
                                        type='button'
                                        className='btn btn-outline-success me-3'
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="bottom"
                                        title='Payments are currently disabled!'
                                    >
                                        Buy more Tokens
                                    </button>
                                    <a href={logoutURL} className='btn btn-danger'>Log-out</a>
                                </div>
                            </div>
                        </div>
                        : <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>

                }
            </div>
        );
    }

export default AccountView;
