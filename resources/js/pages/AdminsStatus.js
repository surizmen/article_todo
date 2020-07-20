import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Http from '../Http';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import delayAdapterEnhancer from 'axios-delay';
const api = Http.create({
  adapter: delayAdapterEnhancer(Http.defaults.adapter)
});

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
});


class AdminsStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todo: null,
      loading: true,
      data: {},
      apiMore: '',
      moreLoaded: false,
      error: false,
      checkOrder: false
    };
    this.onDragEnd = this.onDragEnd.bind(this);

    this.api = '/api/v1/article';
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 330));
  }

  changeOrders(NewOrders, id){
    api.patch(`${this.api}/${id}`, { orders: NewOrders })
      .then(() => {
      })
      .catch(() => {
        this.setState({
          error: 'Не удалось сменить очередь.',
        });
        setTimeout(()=>  this.setState({
          error: false,
        }),3000)
        setTimeout(()=>  location.reload(),3000)
      });
  }

  async onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const data = reorder(
      this.state.data,
      result.source.index,
      result.destination.index
    );

    let dist = result.destination.index;
    let surc = result.source.index
    let arrow = dist - surc;
    let mass = 0;
    let end = 0;
    if (dist>surc){
      mass = surc;
      end = dist;
    }
    else {
      mass = dist;
      end = surc;
    }
    let imass = mass
    if (arrow<0){
      imass++
    }
    if(this.state.checkOrder === true){
      this.setState({
        error: 'Подождите, пока идёт сортировка...',
      });
      setTimeout(()=>  this.setState({
        error: false,
      }),4000)
      return;
    }
    this.setState({
      checkOrder: true
    })

    for (imass; mass<end; imass++){
      mass++
      if(arrow<0){
        await this.delay();
        this.changeOrders(data[imass].orders-=1,data[imass].id)

      }else{
        await this.delay();
        this.changeOrders(data[imass].orders+=1,data[imass].id)
      }
      if (imass>1000){
        break;
      }
    }
    this.changeOrders(data[result.destination.index].orders-=arrow,data[result.destination.index].id);
    this.setState({
      data
    });
    this.setState({
      checkOrder: false
    });
  }

  componentDidMount() {
    this.getIndex()
  }

  getIndex(){
    Http.get(this.api)
      .then((response) => {
        const { data } = response.data;
        const apiMore = response.data.links.next;
        this.setState({
          data,
          apiMore,
          loading: false,
          error: false,
        });
      })
      .catch(() => {
        this.setState({
          error: 'Ошибка получения данных.',
        });
      });
  }

  loadMore = () => {
    this.setState({ loading: true });
    Http.get(this.state.apiMore)
      .then((response) => {
        const { data } = response.data;
        const apiMore = response.data.links.next;
        const dataMore = this.state.data.concat(data);
        this.setState({
          data: dataMore,
          apiMore,
          loading: false,
          moreLoaded: true,
          error: false,
        });
      })
      .catch(() => {
        this.setState({
          error: 'Unable to fetch data.',
        });
      });
  };

  changeStatus = (e) => {
    const { key } = e.target.dataset;
    const { status } = e.target.dataset;
    const { data: todos } = this.state;

    let changestatus = status
    if (changestatus === 'closed') {
      changestatus = 'active'
    }
    else if (changestatus === 'active') {
      changestatus = 'closed'
    }

    Http.patch(`${this.api}/${key}`, { status: changestatus })
      .then(() => {
        this.getIndex()
      })
      .catch(() => {
        this.setState({
          error: 'Не удалось сменить статус.',
        });
      });
  };
  render() {
    const { loading, error, apiMore } = this.state;
       const todos = Array.from(this.state.data);
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="container py-5">
          <h1 className="text-center mb-4">Весь список статей</h1>
               {error && (
                 <div className="text-center">
                   <p>{error}</p>
                 </div>
               )}
               <table className="table">

                 <tr>
                     <th>Время загрузки</th>
                     <th>Заголовок</th>
                     <th>Статус</th>
                    <th>Сменить статус</th>
                   </tr>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <tbody
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {todos.map((data, index) => (
                <Draggable key={data.id.toString()} draggableId={data.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <tr key={data.id}   ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                    <td>
                      {data.created_at}
                    </td>
                      <td
                      >
                        {data.value}
                      </td>
                      <td>
                        {data.status}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={this.changeStatus}
                          data-key={data.id}
                          data-status={data.status}
                        >
                          Сменить статус
                        </button>
                      </td>
                    </tr>)}
                </Draggable>
              ))}
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
               </table>
          {apiMore && (
            <div className="text-center">
              <button
                className={classNames('btn btn-primary', {
                  'btn-loading': loading,
                })}
                onClick={this.loadMore}
              >
                Загрузить больше
              </button>
            </div>
          )}
          {
            apiMore === null && this.state.moreLoaded === true && (
            <div className="text-center">
              <p>Больше нечего загружать.</p>
            </div>
          )
          }
        </div>
      </DragDropContext>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});

export default connect(mapStateToProps)(AdminsStatus);
