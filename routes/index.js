const userRoutes = require('./users')
const actionRoutes = require('./action')
const dashboardRoutes = require('./dashboard')

const constructorMethod = (app) => {
	app.use('/', userRoutes);
	app.use('/dashboard', dashboardRoutes)
	app.use('/action', actionRoutes)

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;