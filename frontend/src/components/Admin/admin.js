import './admin.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/authService';
import { UserCircleIcon, UsersIcon, NewspaperIcon, ChartBarIcon, CalendarDaysIcon, QuestionMarkCircleIcon, BriefcaseIcon, UserGroupIcon, ChatBubbleLeftRightIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

import Account      from './sections/Account';
import Participants from './sections/Participants';
import News         from './sections/News';
import Stats        from './sections/Stats';
import Program      from './sections/Program';
import Faq          from './sections/Faq';
import Cases        from './sections/Cases';
import Partners     from './sections/Partners';
import Reviews      from './sections/Reviews';
import Photos       from './sections/Photos';
import Policy       from './sections/Policy';

const NAV_ITEMS = [
  { id: 'participants', label: 'участники',  Icon: UsersIcon,                  Component: Participants },
  { id: 'news',         label: 'новости',    Icon: NewspaperIcon,               Component: News },
  { id: 'stats',        label: 'статистика', Icon: ChartBarIcon,                Component: Stats },
  { id: 'program',      label: 'программа',  Icon: CalendarDaysIcon,            Component: Program },
  { id: 'faq',          label: 'faq',        Icon: QuestionMarkCircleIcon,      Component: Faq },
  { id: 'cases',        label: 'кейсы',      Icon: BriefcaseIcon,               Component: Cases },
  { id: 'partners',     label: 'партнеры',   Icon: UserGroupIcon,               Component: Partners },
  { id: 'reviews',      label: 'отзывы',     Icon: ChatBubbleLeftRightIcon,     Component: Reviews },
  { id: 'photos',       label: 'фотоальбом', Icon: PhotoIcon,                   Component: Photos },
  { id: 'policy',       label: 'политика',   Icon: DocumentTextIcon,            Component: Policy },
];

export default function Admin() {
  const [active, setActive] = useState('account');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const renderContent = () => {
    if (active === 'account') return <Account />;
    const item = NAV_ITEMS.find(n => n.id === active);
    const Section = item?.Component;
    return Section ? <Section /> : null;
  };

  return (
    <div className="admin-layout">

      {/* Топ строка: лого слева, юзер справа */}
      <header className="admin-topbar">
        <div className="admin-logo">
          <img src="/images/logo2.svg" alt="logo" />
        </div>
        <div className="admin-topbar-user">
          <UserCircleIcon className="admin-topbar-icon" />
          <span>admin</span>
        </div>
      </header>

      {/* Нижняя строка: сайдбар + контент одной высоты */}
      <div className="admin-body">
        <aside className="admin-sidebar">
          <div className="admin-profile" onClick={() => setActive('account')}>
            <UserCircleIcon className="admin-avatar-icon" />
            <div>
              <p className="admin-profile-name">admin</p>
              <button className="admin-logout-btn" onClick={(e) => { e.stopPropagation(); handleLogout(); }}>
                выйти
              </button>
            </div>
          </div>

          <nav className="admin-nav">
            {NAV_ITEMS.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`admin-nav-item ${active === id ? 'admin-nav-item--active' : ''}`}
                onClick={() => setActive(id)}
              >
                <Icon className="admin-nav-icon" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="admin-content">
          {renderContent()}
        </main>
      </div>

      <img src="/images/virus1.svg" alt="" className="admin-dino" />
    </div>
  );
}
