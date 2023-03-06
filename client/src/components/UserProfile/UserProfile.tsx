import { useState, type FC } from 'react';
import './UserProfile.css';
import { useQuery } from 'react-query';

const UserProfile: FC<{ showUserData: boolean }> = ({ showUserData }) => {
    const [userInfo, setUserInfo] = useState<{ name: string, tokens: number } | null>(null);
    const getUserInfo = useQuery({ queryKey: ['user'], queryFn: fetchUserInfo })

    function fetchUserInfo (): any {
        return fetch('http://localhost:9999/user', {
            method: 'GET',
            credentials: 'include'
        }
        ).then(
            async res => await res.json()
        ).then(
            data => {
                if (data.message !== undefined) {
                    console.error(data.message);
                    setUserInfo(null);
                    return;
                }
                setUserInfo(data);
            }
        ).catch(err => {
            console.error(err.message)
        });
    }

    if (!showUserData) {
        return null;
    }

    if (getUserInfo.isLoading) {
        return (
            <aside className='user'>
            </aside>
        );
    }

    if (userInfo !== null) {
        return (
            <aside className='user'>
                <span className='user__tokens' >Tokens: <strong className='user__tokens__value'>{userInfo.tokens}</strong></span>
                <span className='user__name' >{userInfo.name}</span>
                <a href='http://localhost:9999/auth/logout' className='user__button btn--1'>Log-out</a>
            </aside>
        );
    }

    return (
        <aside className='user'>
            <span className='user__name' >You are currently logged out!</span>
            <a href='http://localhost:9999/auth/login' className='user__button btn--1'>Log-in</a>
        </aside>
    );
}

export default UserProfile;
