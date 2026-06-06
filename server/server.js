const { app, server, connectDB } = require('./app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket.io ready at http://localhost:${PORT}`);
  });
};

startServer();
