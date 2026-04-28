// // Socket Debugging Utility
// // Add this to browser console to test socket connection

// export const testSocketConnection = async () => {
//   const SOCKET_URL = 'http://localhost:3688';
//   const userId = localStorage.getItem('user_info') 
//     ? JSON.parse(localStorage.getItem('user_info')).id || JSON.parse(localStorage.getItem('user_info'))._id
//     : 'test-user';

//   console.log('=== Socket Connection Test ===');
//   console.log('Socket URL:', SOCKET_URL);
//   console.log('User ID:', userId);
//   console.log('');

//   try {
//     const { io } = await import('socket.io-client');
    
//     const socket = io(SOCKET_URL, {
//       transports: ['websocket', 'polling'],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       withCredentials: true,
//     });

//     socket.on('connect', () => {
//       console.log('✅ Socket Connected! ID:', socket.id);
//       socket.emit('join', { id: userId, type: 'user' });
//       console.log('✅ Join event emitted');
//     });

//     socket.on('connect_error', (error) => {
//       console.error('❌ Connection Error:', error);
//     });

//     socket.on('disconnect', (reason) => {
//       console.log('❌ Disconnected. Reason:', reason);
//     });

//     socket.on('error', (error) => {
//       console.error('❌ Socket Error:', error);
//     });

//     socket.on('new_notification', (data) => {
//       console.log('✅ Notification Received:', data);
//     });

//     // Keep socket open for 10 seconds
//     setTimeout(() => {
//       console.log('Closing test socket...');
//       socket.disconnect();
//     }, 10000);

//   } catch (error) {
//     console.error('❌ Error:', error);
//   }
// };

// // Usage in browser console:
// // import { testSocketConnection } from '@/utils/socketDebug'
// // testSocketConnection()
