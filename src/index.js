const React = require('react');
import { render } from 'react-dom';
const axios = require('axios');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      departments: [],
      employees: [],
    };
    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
    this.destroy = this.destroy.bind(this);
    this.create = this.create.bind(this);
  }
  async create(ev) {
    ev.preventDefault();
    const department = (await axios.post('/api/departments')).data;
    const departments = this.state.departments;
    departments.push(department);
    this.setState({ departments });
  }
  async create(ev) {
    ev.preventDefault();
    const employee = (await axios.post('/api/employees')).data;
    const employees = this.state.employees;
    employees.push(employee);
    this.setState({ employees });
  }
  async componentDidMount() {
    this.setState({ departments: (await axios.get('/api/departments')).data });
    this.setState({ employees: (await axios.get('/api/employees')).data });
  }
  async increase(employee) {
    employee = (
      await axios.put(`/api/employees/${employee.id}`, {
        total: ++employee.total,
      })
    ).data;
    const employees = this.state.employees.map((e) =>
      e.id === employee.id ? employee : e
    );
    this.setState({ employees });
  }

  async decrease(employee) {
    employee = (
      await axios.put(`/api/employees/${employee.id}`, {
        total: --employee.total,
      })
    ).data;
    const employees = this.state.employees.map((e) =>
      e.id === employee.id ? employee : e
    );
    this.setState({ employees });
  }
  async destroy(employee) {
    await axios.delete(`/api/employees/${employee.id}`);
    const employees = this.state.employees.filter((e) => e.id !== employee.id);
    this.setState({ employees });
  }
  render() {
    const { departments } = this.state;
    const { employees } = this.state;
    const { increase, decrease, destroy, create } = this;
    return (
      <div>
        <h1>Acme Employees and Departments</h1>
        <h3>({employees.total}) Total Employees</h3>
        <form onSubmit={create}>
          <button>Add Department</button>
        </form>
        <div className="no_Dept">
          Employee Without Department ({employees.total})
          <div>
            {departments.map((department) => {
              return (
                <span key={department.id}>
                  <h2>
                    {department.name} ({employees.total})
                  </h2>
                  <div>
                    {employees.map((employee) => {
                      return (
                        <ul id="employee_list">
                          <li key={employee.id}>
                            <h3>{employees.name}</h3>
                            <button onClick={() => destroy(employee)}>x</button>
                            <button onClick={() => decrease(employee)}>
                              Remove From Department
                            </button>
                            <button onClick={() => increase(employee)}>
                              Add To Employee Without Department
                            </button>
                          </li>
                        </ul>
                      );
                    })}
                  </div>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
render(<App />, document.querySelector('#root'));
