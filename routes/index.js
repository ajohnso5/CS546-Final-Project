const userRoutes = require('./users')
const actionRoutes = require('./action')

const constructorMethod = (app) => {
	app.use('/', userRoutes);
	app.use('/action', actionRoutes)

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;