import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import CRUDTable,
{
  Fields,
  Field,
  CreateForm,
  UpdateForm,
  DeleteForm,
} from 'react-crud-table';
// Component's Base CSS
import './index.css';

class App extends Component {
  SORTERS = {
    NUMBER_ASCENDING: mapper => (a, b) => mapper(a) - mapper(b),
    NUMBER_DESCENDING: mapper => (a, b) => mapper(b) - mapper(a),
    STRING_ASCENDING: mapper => (a, b) => mapper(a).localeCompare(mapper(b)),
    STRING_DESCENDING: mapper => (a, b) => mapper(b).localeCompare(mapper(a)),
  };
  getSorter = (data) => {
    const mapper = x => x[data.field];
    let sorter = this.SORTERS.STRING_ASCENDING(mapper);

    if (data.field === 'id') {
      sorter = data.direction === 'ascending' ?
        this.SORTERS.NUMBER_ASCENDING(mapper) : this.SORTERS.NUMBER_DESCENDING(mapper);
    } else {
      sorter = data.direction === 'ascending' ?
        this.SORTERS.STRING_ASCENDING(mapper) : this.SORTERS.STRING_DESCENDING(mapper);
    }

    return sorter;
  };
  fetchItems= (payload) => {
    let result = this.callGetApi();
    return Promise.resolve(result);
  };
  callGetApi = async () => {
     const response = await fetch('/api/products');
     const body = await response.json();
     if (response.status !== 200) throw Error(body.message);
     return body;
   };
   callPostApi= async (product) => {
      const response = await axios.post('/api/products',product);
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
      return body;
  };
  create= (product) => {
    this.callPostApi(product);
    this.fetchItems();
  };
  update= (data) => {
      const task = this.tasks.find(t => t.id === data.id);
      task.title = data.title;
      task.description = data.description;
      return Promise.resolve(task);
    };
  delete= (data) => {
      const task = this.tasks.find(t => t.id === data.id);
      //tasks = this.tasks.filter(t => t.id !== task.id);
      return Promise.resolve(task);
    };
  Example = () => (
    <div style={this.styles.container}>
      <CRUDTable
        caption="Products"
        fetchItems={payload => this.fetchItems(payload)}
      >
        <Fields>

          <Field
            name="title"
            label="Title"
            placeholder="Title"
          />
          <Field
            name="price"
            label="Price"
            placeholder="Price"
          />
          <Field
            name="quantity"
            label="Quantity"
            placeholder='Quantity'
          />
          <Field
            name="url"
            label="URL"
            placeholder='URL'
          />
        </Fields>
        <CreateForm
          title="Product Creation"
          message="Create a new product!"
          trigger="Create Product"
          onSubmit={task => this.create(task)}
          submitText="Create"
          validate={(values) => {
            const errors = {};
            if (!values.title) {
              errors.title = 'Please, provide product\'s title';
            }

            if (!values.price) {
              errors.description = 'Please, provide product\'s price';
            }

            if (!values.quantity) {
              errors.description = 'Please, provide product\'s quantity';
            }

            if (!values.url) {
              errors.description = 'Please, provide product\'s url';
            }

            return errors;
          }}
        />

        <UpdateForm
          title="Product update process"
          message="Update product"
          trigger="Update"
          onSubmit={task => this.update(task)}
          submitText="Update"
          validate={(values) => {
            const errors = {};

            if (!values.title) {
              errors.title = 'Please, provide product\'s title';
            }

            if (!values.price) {
              errors.description = 'Please, provide product\'s price';
            }

            if (!values.quantity) {
              errors.description = 'Please, provide product\'s quantity';
            }

            if (!values.url) {
              errors.description = 'Please, provide product\'s url';
            }

            return errors;
          }}
        />

        <DeleteForm
          title="Product Delete Process"
          message="Are you sure you want to delete the product?"
          trigger="Delete"
          onSubmit={task => this.delete(task)}
          submitText="Delete"
          validate={(values) => {
            const errors = {};
            if (!values.id) {
              errors.id = 'Please, provide id';
            }
            return errors;
          }}
        />
      </CRUDTable>
    </div>
  );
  styles = {
   container: { margin: 'auto', width: 'fit-content' },
  };
  tasks = [
    {
      id: 1,
      title: 'Create an example',
      description: 'Create an example of how to use the component',
    },
    {
      id: 2,
      title: 'Improve',
      description: 'Improve the component!',
    },
  ];
  count = this.tasks.length;
  render() {
    this.Example.propTypes = {};
    return (
      <this.Example />
    );
  }
}

export default App;
