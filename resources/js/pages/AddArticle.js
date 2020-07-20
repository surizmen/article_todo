import React, {Component} from 'react';
import {connect} from 'react-redux';
import Http from '../Http';
import FormData from 'form-data'
import ReeValidate from "ree-validate";
import classNames from 'classnames';


class AddArticle extends Component {
  constructor(props) {
    super(props);

    this.validator = new ReeValidate({
      inputName: 'required|min:3',
      description: 'required|min:3',
    });


    // Initial state
    this.state = {
      errors: {},
      inputName: null,
      description: null,
      imageurl: null,
      image: {},
      error: false,
      data: [],
      response: {
        error: false,
        message: '',
      },
    };

    this.api = '/api/v1/article';

    this.onImageChange = this.onImageChange.bind(this);
  }

  onImageChange = event => {
    let img = event.target.files;
    this.setState({ image: img[0] , imageurl: URL.createObjectURL(img[0])});
  };

  handleChange = (e) => {
    const {name, value} = e.target;
    this.setState({[name]: value});
    const { errors } = this.state;
    if (name in errors) {
      const validation = this.validator.errors;
      this.validator.validate(name, value).then(() => {
        if (!validation.has(name)) {
          delete errors[name];
          this.setState({ errors });
        }
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {inputName, image, description} = this.state;
    this.addTodo(inputName, image, description);
  };

  addTodo = (inputName, image, description) => {
    var formData = new FormData();
    formData.append('value', inputName);
    formData.append('description', description);
    formData.append('image', image);

    Http.post(this.api, formData,
      {
        headers: {
          'Content-Type': `multipart/form-data`,
        }
      }
    )
      .then(({data}) => {
        const newItem = {
          id: data.id,
          value: inputName,
          image: image,
        };
        const allMerc = [newItem, ...this.state.data];
        this.setState({data: allMerc, inputName: null});
        this.todoForm.reset();
        this.setState({
          error: 'Статья успешно добавлена и ожидает модерации.',
        });
      })
      .catch((err) => {
      const errors = Object.values(err.response.data.errors);
      errors.join(' ');
      const response = {
        error: true,
        message: errors,
      };
      this.setState({ response });
    });
  };


  render() {
    const {data, error,errors, response} = this.state;
    return (
      <div className="container py-5">
        <div className="add-todos mb-5">
          <h1 className="text-center mb-4">Добавить статью</h1>
          {response.error && (
            <div
              className="alert alert-danger text-center"
              role="alert"
            >
              {response.message}
            </div>
          )}
          <form
            method="post"
            onSubmit={this.handleSubmit}
            ref={(el) => {
              this.todoForm = el;
            }}
          >
            {this.state.imageurl !==null && (<img src={this.state.imageurl} alt={this.state.image.name} className="imgprv"/>)}
            <div className="form-group">
              <label htmlFor="value">Заголовок</label>
              <div className="form-group">
                <input
                  id="value"
                  name="inputName"
                  className={classNames('form-control', {
                    'is-invalid': 'inputName' in errors,
                  })}
                  placeholder="Введите заголовок.."
                  onChange={this.handleChange}
                />
                <label htmlFor="value">Описание</label>
                <input
                  id="description"
                  name="description"
                  className={classNames('form-control', {
                    'is-invalid': 'description' in errors,
                  })}
                  placeholder="Введите описание.."
                  onChange={this.handleChange}
                />
                <input type="file" name="myImage" onChange={this.onImageChange} placeholder="Загрузите файл"/>
                <button type="submit" className="btn btn-primary">
                  Отправить
                </button>
              </div>
            </div>
          </form>
        </div>

        {error && (
          <div className="alert alert-warning" role="alert">
            {error}
          </div>
        )}

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});

export default connect(mapStateToProps)(AddArticle);
