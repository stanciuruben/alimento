import type { FC } from 'react';
import './UserProfile.css';
import { useQuery } from 'react-query';
import fetchUserInfo from '../../lib/fetchUserInfo';

const UserProfile: FC<{ showUserData: boolean }> = ({ showUserData }) => {
    const { isLoading, data } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUserInfo,
        retry: false,
        placeholderData: null
    });

    if (!showUserData) {
        return null;
    }

    if (isLoading) {
        return <aside className='user'></aside>;
    }

    if (
        data?.name !== undefined
    ) {
        return (
            <aside className='user'>
                <span className='user__tokens'>
                    Tokens:{' '}
                    <strong className='user__tokens__value'>
                        {data.tokens}
                    </strong>
                </span>
                <span className='user__name'>{data.name}</span>
                <a
                    href='http://localhost:9999/auth/logout'
                    className='user__button btn--1'
                >
                    Log-out
                </a>
            </aside>
        );
    }

    return (
        <aside className='user'>
            <span className='user__name'>You are currently logged out!</span>
            <a
                href='http://localhost:9999/auth/login'
                className='user__button btn--1'
            >
                Log-in
            </a>
        </aside>
    );
};

export default UserProfile;
