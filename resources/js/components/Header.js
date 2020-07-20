import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import * as actions from '../store/actions';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
        role: null
    };

  }
  handleLogout = (e) => {
    e.preventDefault();
    this.props.dispatch(actions.authLogout());
    location.reload()
  };

  UNSAFE_componentWillMount () {
    try {
      this.setState({role: this.props.user.role})
    }
    catch(e) {
      if (this.props.isAuthenticated === false){
        this.authChecker()
        this.setState({role: 3})
      }
    }

  }
  authChecker(){
    if (this.props.user === null){
      this.props.dispatch(actions.authLogout());
    }
  }
  render() {
    return (
      <header className="header">
        <h1 className="header-logo">
          <Link to="/" className="header-logo__link">Новости</Link>
        </h1>
        {this.props.isAuthenticated ? (
            <Nav className="header-nav">
              <NavItem className="header-nav-item">
                <NavLink className="header-nav-item__link" tag={Link} to="/add-article">
                  Добавить статью
                </NavLink>
              </NavItem>

              <UncontrolledDropdown nav inNavbar className="header-nav-item">
                <DropdownToggle nav caret className="header-nav-item__link">
                  Аккаунт
                </DropdownToggle>
                <DropdownMenu right className="header-nav-item__link">
                  <DropdownItem onClick={this.handleLogout} className="header-nav-item__link">
                    Выйти из аккаунта
                  </DropdownItem>
                  {this.state.role === 1 &&
                  (
                    <DropdownItem tag={Link} to="/admin-status">
                      Админка
                    </DropdownItem>)
                  }

                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>

        ) :
          (
              <Nav className="header-nav">
                <NavItem className="header-nav-item">
                  <NavLink tag={Link} to="/login" className="header-nav-item__link">
                    Войти
                  </NavLink>
                </NavItem>

              </Nav>

          )
        }
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});

export default connect(mapStateToProps)(Header);
