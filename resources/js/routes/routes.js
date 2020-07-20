import Login from '../pages/Login';
import MainArticle from '../pages/MainArticle';
import Register from '../pages/Register';
import AdminsStatus from '../pages/AdminsStatus';
import NoMatch from '../pages/NoMatch';
import AddArticle from "../pages/AddArticle";

const routes = [
  {
    path: '/',
    exact: true,
    auth: true,
    component: MainArticle,
    fallback: MainArticle,
  },
  {
    path: '/login',
    exact: true,
    auth: false,
    component: Login,
  },
  {
    path: '/register',
    exact: true,
    auth: false,
    component: Register,
  },
  {
    path: '/admin-status',
    exact: true,
    auth: true,
    component: AdminsStatus,
  },
  {
    path: '/add-article',
    exact: true,
    auth: true,
    component: AddArticle,
  },
  {
    path: '',
    exact: false,
    auth: false,
    component: NoMatch,
  },
];

export default routes;
