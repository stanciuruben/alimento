import { type FC } from 'react';

const HelpModal: FC = () => {
    return (
        <div className="modal fade" id="help-modal" tabIndex={-1} aria-labelledby="help-modal-label" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="help-modal-label">Help / Instructions</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="accordion" id="help-tabs">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="generate-plan-label">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        aria-expanded="false"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#generate-plan"
                                        aria-controls="generate-plan"
                                    >
                                        How to generate a new meal plan?
                                    </button>
                                </h2>
                                <div
                                    id="generate-plan"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="generate-plan-label"
                                    data-bs-parent="#help-tabs"
                                >
                                    <div className="accordion-body">
                                        <ol className='list-group-numbered'>
                                            <li className='mb-5'>
                                                <span>Navigate to the Account tab and make sure your balance is not empty!</span>
                                                <div className="d-relative p-1 bg-dark mt-3">
                                                    <img
                                                        src="help/b-account.jpg"
                                                        alt='Screenshot of navigation bar with a selected tab "Meal Plans"'
                                                        className='object-contain w-100'
                                                    />
                                                </div>
                                            </li>
                                            <li className='mb-5'>
                                                <span>Navigate to the Meal Plans Tab!</span>
                                                <div className="d-relative p-1 bg-dark mt-3">
                                                    <img
                                                        src="help/m-nav.jpg"
                                                        alt='Screenshot of navigation bar with a selected tab "Meal Plans"'
                                                        className='object-contain w-100'
                                                    />
                                                </div>
                                            </li>
                                            <li className='mb-5'>
                                                <span>Click on the "Generate New Plan" button from the section beneath the navigation!</span>
                                                <div className="d-relative p-1 bg-dark mt-3">
                                                    <img
                                                        src="help/gp-nav.jpg"
                                                        alt='"Meal Plans" tab with highlighted "Generate New Plan" button beneath it'
                                                        className='object-contain w-100'
                                                    />
                                                </div>
                                            </li>
                                            <li className='mb-5'>
                                                <span>Fill out the form and click "Generate"!</span>
                                                <div className="d-relative p-1 bg-dark mt-3">
                                                    <img
                                                        src="help/g-form.jpg"
                                                        alt="Screenshot of Plan generation form with"
                                                        className='object-contain w-100'
                                                    />
                                                </div>
                                            </li>
                                            <li>
                                                <span>Enjoy the outcome!</span>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="stats-label">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button" data-bs-toggle="collapse"
                                        data-bs-target="#stats"
                                        aria-expanded="false"
                                        aria-controls="stats"
                                    >
                                        What is the statistics tab about?
                                    </button>
                                </h2>
                                <div
                                    id="stats"
                                    className="accordion-collapse collapse"
                                    aria-labelledby="stats-label"
                                    data-bs-parent="#help-tabs"
                                >
                                    <div className="accordion-body">
                                        <p>
                                            The app selects a random mealplan for every day that you login,
                                            (However you can easily select another plan in the "Meal Plans" tab)
                                            and uses that data to generate an overview of the macronutrients and kcal that of the selected meal plans.
                                            <br />
                                            <br />
                                            <strong>
                                                This only works in real life if the user respects the meal plan to the letter, or has some knowledge about nutrition and can make educated adjustments.
                                            </strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HelpModal;
