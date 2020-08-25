const Sequelize = require('sequelize');
const chalk = require('chalk');
const { STRING, INTEGER, BOOLEAN, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/acme_company'
);
const faker = require('faker');

const Department = conn.define('department', {
  id: {
    type: UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
});

const Employee = conn.define('employee', {
  name: {
    type: STRING,
    allowNull: false,
  },
  total: {
    type: INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
});

// const Membership = conn.define('membership', {
//   id: {
//     type: UUID,
//     primaryKey: true,
//     defaultValue: UUIDV4,
//   },
//   hasDepartment: {
//     type: BOOLEAN,
//     defaultValue: false,
//   },
// });

Department.hasMany(Employee);
Employee.belongsTo(Department);
// Membership.belongsTo(Employee);
// Membership.belongsTo(Department);

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const depPromises = [];
  const empPromises = [];
  while (depPromises.length < 5) {
    depPromises.push(
      Department.create({
        name: faker.commerce.department(),
      })
    );
  }
  while (empPromises.length < 10) {
    empPromises.push(
      Employee.create({
        name: faker.name.findName(),
      })
    );
  }

  await Promise.all(depPromises);
  await Promise.all(empPromises);

  // const department = await Department.findAll({
  //   include: [
  //     {
  //       model: Membership,
  //       include: [Employee],
  //     },
  //   ],
  // });
  // console.log(JSON.stringify(department, null, 2));
};

module.exports = {
  syncAndSeed,
  models: {
    Employee,
    Department,
  },
};
