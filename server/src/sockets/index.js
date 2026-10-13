export function initSockets(io) {
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {});
  });
}
