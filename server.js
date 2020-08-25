const express = require('express');
const app = express();
const path = require('path');
const db = require('./db');
const { Employee, Department } = db.models;
const faker = require('faker');

app.use(require('body-parser').json());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/api/departments', async (req, res, next) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/employees', async (req, res, next) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (ex) {
    next(ex);
  }
});

app.post('/api/employees', async (req, res, next) => {
  try {
    res.send(await Employee.create({ name: faker.name.findName() }));
  } catch (ex) {
    next(ex);
  }
});

app.post('/api/departments', async (req, res, next) => {
  try {
    res.send(await Department.create({ name: faker.commerce.department() }));
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/departments/:id', async (req, res, next) => {
  try {
    const department = await Department.findByPk(req.params.id, {
      include: employee,
    });
    res.json(department);
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/employees/:id', async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: Department,
    });
    res.json(employee);
  } catch (ex) {
    next(ex);
  }
});

app.put('/api/departments/:id', async (req, res, next) => {
  try {
    const department = await Department.findByPk(req.params.id);
    await department.update(req.body);
    res.send(department);
  } catch (ex) {
    next(ex);
  }
});

app.put('/api/employees/:id', async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    await employee.update(req.body);
    res.send(employee);
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/departments/:id', async (req, res, next) => {
  try {
    const department = await Department.findByPk(req.params.id);
    await department.destroy();
    // await Department.destroy({
    //   where: {
    //     id: req.params.id
    //   }
    // })
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/employees/:id', async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    await employee.destroy();
    // await Employee.destroy({
    //   where: {
    //     id: req.params.id
    //   }
    // })
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});

const port = process.env.PORT || 3000;

const init = async () => {
  try {
    await db.syncAndSeed();
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();

module.exports = app;
