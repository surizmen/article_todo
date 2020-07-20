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
            <Nav>
              <NavItem>
                <NavLink tag={Link} to="/add-article">
                  Добавить статью
                </NavLink>
              </NavItem>

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Аккаунт
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={this.handleLogout}>
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
          (<div className="navigation d-flex justify-content-end">
              <Nav>
                <NavItem>
                  <NavLink tag={Link} to="/login">
                    Войти
                  </NavLink>
                </NavItem>

              </Nav>
            </div>
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
