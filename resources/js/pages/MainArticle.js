import React, { Component } from 'react';
import { connect } from 'react-redux';
import Http from '../Http';

class MainArticle extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      todo: null,
      error: false,
      data: [],
    };

    // API endpoint.
    this.api = '/api/v1/article';
  }

  componentDidMount() {
    Http.get(`${this.api}?status=open`)
      .then((response) => {
        const {data} = response.data;
        this.setState({
          data,
          error: false,
        });
      })
      .catch(() => {
        this.setState({
          error: 'Не удалось получить данные.',
        });
      });
  }

  render() {
    const { data, error } = this.state;

    return (
      <div className="container py-5">
        {error && (
          <div className="alert alert-warning" role="alert">
            {error}
          </div>
        )}

        <div className="articles">
          <h1 className="articles articles__maidenhead">Активные новости</h1>
              {data.map((todo) => (
                <div key={todo.id} className="articles articles__item">
                  <p>{todo.value}</p>
                  {todo.image ? <img src={'/images/'+todo.image} alt={todo.value}/> :
                    <img src={'/images/video-poster.jpg'} alt={todo.value}/>
                  }
                  <p>{todo.description}</p>
                </div>
              ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});

export default connect(mapStateToProps)(MainArticle);
